import { Payment, IPayment, Order } from '../../database';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { PaginationUtils } from '../../common/utils';
import { PaginationQuery, FilterQuery, PaymentStatus, PaymentMethod, OrderStatus } from '../../common/types';
import { RazorpayService } from '../../common/services/razorpay.service';
import { env } from '../../config/env';

export interface CreatePaymentData {
  orderId: string;
  paymentIntentId: string;
  method: PaymentMethod;
  amount: number;
  currency?: string;
  metadata?: any;
}

export class PaymentsService {
  public static async getPayments(pagination: PaginationQuery, filters: FilterQuery) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
    const { status, search } = filters;

    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.paymentIntentId = { $regex: search, $options: 'i' };
    }

    const skip = PaginationUtils.getSkip(page, limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('order', 'orderNumber totalAmount customer')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query),
    ]);

    const paginationInfo = PaginationUtils.calculatePagination(page, limit, total);

    return { payments, pagination: paginationInfo };
  }

  public static async getPaymentById(paymentId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId)
      .populate('order', 'orderNumber totalAmount customer email');
    
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    return payment;
  }

  public static async getPaymentByIntentId(paymentIntentId: string): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentIntentId })
      .populate('order', 'orderNumber totalAmount customer email');
    
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    return payment;
  }

  public static async getPaymentsByOrder(orderId: string): Promise<IPayment[]> {
    const payments = await Payment.find({ order: orderId }).sort({ createdAt: -1 });
    return payments;
  }

  public static async createPayment(data: CreatePaymentData): Promise<IPayment> {
    // Verify order exists
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ paymentIntentId: data.paymentIntentId });
    if (existingPayment) {
      throw new AppError('Payment already exists', HTTP_STATUS.CONFLICT);
    }

    const payment = new Payment({
      order: data.orderId,
      paymentIntentId: data.paymentIntentId,
      method: data.method,
      amount: data.amount,
      currency: data.currency || 'INR',
      metadata: data.metadata,
      status: PaymentStatus.PENDING,
    });

    await payment.save();
    return payment;
  }

  public static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    gatewayResponse?: any,
    failureReason?: string
  ): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    payment.status = status;
    if (gatewayResponse) {
      payment.gatewayResponse = gatewayResponse;
    }
    if (failureReason) {
      payment.failureReason = failureReason;
    }
    if (status === PaymentStatus.COMPLETED) {
      payment.processedAt = new Date();
    }

    await payment.save();

    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: status,
      paymentIntentId: payment.paymentIntentId,
    });

    return payment;
  }

  public static async processRefund(
    paymentId: string,
    amount: number,
    reason?: string,
    refundId?: string
  ): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new AppError('Can only refund completed payments', HTTP_STATUS.BAD_REQUEST);
    }

    const totalRefunded = payment.refunds.reduce((sum, r) => sum + r.amount, 0);
    if (totalRefunded + amount > payment.amount) {
      throw new AppError('Refund amount exceeds payment amount', HTTP_STATUS.BAD_REQUEST);
    }

    // If payment was completed through Razorpay and has a paymentIntentId, process gateway refund
    let finalRefundId = refundId;
    if (payment.method === PaymentMethod.RAZORPAY && payment.paymentIntentId) {
      try {
        const rzpRefund = await RazorpayService.refundPayment(payment.paymentIntentId, amount, {
          reason: reason || 'Merchant Processed Refund',
        });
        if (rzpRefund?.id) {
          finalRefundId = rzpRefund.id;
        }
      } catch (err: any) {
        console.error('[PaymentsService] Razorpay gateway refund error:', err);
        if (env.NODE_ENV === 'production') {
          throw new AppError(err?.message || 'Payment gateway refund failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
      }
    }

    payment.refunds.push({
      amount,
      reason,
      refundId: finalRefundId || `REF-${Date.now()}`,
      processedAt: new Date(),
    });

    // If fully refunded, update status
    if (totalRefunded + amount === payment.amount) {
      payment.status = PaymentStatus.REFUNDED;
    }

    await payment.save();

    // Update order
    const order = await Order.findById(payment.order);
    if (order) {
      order.refundAmount = (order.refundAmount || 0) + amount;
      order.refundReason = reason;
      if (totalRefunded + amount === payment.amount) {
        order.paymentStatus = PaymentStatus.REFUNDED;
      }
      await order.save();
    }

    return payment;
  }

  public static async handleWebhookEvent(event: string, payload: any) {
    const paymentEntity = payload?.payment?.entity;
    const orderEntity = payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    if (!razorpayOrderId) {
      console.warn('[PaymentsService] Webhook event missing razorpay order_id:', event);
      return;
    }

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      console.warn('[PaymentsService] Order not found for webhook order_id:', razorpayOrderId);
      return;
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      order.paymentStatus = PaymentStatus.COMPLETED;
      if (razorpayPaymentId) {
        order.razorpayPaymentId = razorpayPaymentId;
      }
      order.status = OrderStatus.CONFIRMED;
      await order.save();

      // Upsert payment record
      await Payment.findOneAndUpdate(
        { order: order._id },
        {
          order: order._id,
          paymentIntentId: razorpayPaymentId || razorpayOrderId,
          method: PaymentMethod.RAZORPAY,
          amount: order.totalAmount,
          currency: order.currency || 'INR',
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
          metadata: paymentEntity || orderEntity,
        },
        { upsert: true, new: true }
      );
    } else if (event === 'payment.failed') {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();

      await Payment.findOneAndUpdate(
        { order: order._id },
        {
          order: order._id,
          paymentIntentId: razorpayPaymentId || razorpayOrderId,
          method: PaymentMethod.RAZORPAY,
          amount: order.totalAmount,
          currency: order.currency || 'INR',
          status: PaymentStatus.FAILED,
          failureReason: paymentEntity?.error_description || 'Payment Failed',
          metadata: paymentEntity,
        },
        { upsert: true, new: true }
      );
    }
  }

  public static async getPaymentStats() {
    const [
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue,
      totalRefunded,
    ] = await Promise.all([
      Payment.countDocuments(),
      Payment.countDocuments({ status: PaymentStatus.COMPLETED }),
      Payment.countDocuments({ status: PaymentStatus.PENDING }),
      Payment.countDocuments({ status: PaymentStatus.FAILED }),
      Payment.countDocuments({ status: PaymentStatus.REFUNDED }),
      Payment.aggregate([
        { $match: { status: PaymentStatus.COMPLETED } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $unwind: '$refunds' },
        { $group: { _id: null, total: { $sum: '$refunds.amount' } } },
      ]),
    ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalRefunded: totalRefunded[0]?.total || 0,
    };
  }
}
