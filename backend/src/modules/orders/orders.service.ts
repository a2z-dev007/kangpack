import { Order, IOrder, Cart, Product, User, Coupon } from '../../database';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { PaginationUtils, PasswordUtils, toFullImageUrl } from '../../common/utils';
import { PaginationQuery, FilterQuery, OrderStatus, PaymentStatus, PaymentMethod, CouponType } from '../../common/types';
import { MailService } from '../../common/services/mail.service';
import { RazorpayService } from '../../common/services/razorpay.service';
import { env } from '../../config/env';
import { SettingsService } from '../settings/settings.service';
import crypto from 'crypto';

export interface CreateOrderData {
  email: string;
  phone?: string;
  shippingAddress: any;
  billingAddress?: any;
  shippingMethod?: string;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
  createAccount?: boolean;
  password?: string;
}

export class OrdersService {
  public static async getOrders(
    pagination: PaginationQuery,
    filters: FilterQuery,
    userId?: string
  ) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
    const { status, search, startDate, endDate, paymentStatus, paymentMethod, minAmount, maxAmount } = filters;

    const query: any = {};
    
    if (userId) {
      query.customer = userId;
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { "shippingAddress.firstName": { $regex: search, $options: 'i' } },
        { "shippingAddress.lastName": { $regex: search, $options: 'i' } },
        { "items.name": { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = parseFloat(minAmount);
      if (maxAmount) query.totalAmount.$lte = parseFloat(maxAmount);
    }

    const skip = PaginationUtils.getSkip(page, limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'firstName lastName email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    const paginationInfo = PaginationUtils.calculatePagination(page, limit, total);

    return { orders, pagination: paginationInfo };
  }

  public static async getOrderById(orderId: string, userId?: string): Promise<IOrder> {
    const query: any = { _id: orderId };
    if (userId) {
      query.customer = userId;
    }

    const order = await Order.findOne(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name slug images');
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return order;
  }

  public static async getOrderByNumber(orderNumber: string, userId?: string): Promise<IOrder> {
    const query: any = { orderNumber };
    if (userId) {
      query.customer = userId;
    }

    const order = await Order.findOne(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name slug images');
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return order;
  }

  public static async createOrder(
    data: CreateOrderData,
    userId?: string,
    sessionId?: string
  ): Promise<IOrder> {
    // Get cart by user or session
    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      throw new AppError(MESSAGES.CART_EMPTY, HTTP_STATUS.BAD_REQUEST);
    }

    // Verify stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product as any;
      if (!product) {
        throw new AppError(`Product not found`, HTTP_STATUS.NOT_FOUND);
      }

      if (product.trackQuantity && product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      orderItems.push({
        product: product._id,
        variant: item.variant,
        name: product.name,
        sku: product.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: toFullImageUrl(product.images?.[0]),
      });

      // Reduce stock
      if (product.trackQuantity) {
        product.stock -= item.quantity;
        product.salesCount += item.quantity;
        await product.save();
      }
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Fetch store settings for tax and shipping
    const settings = await SettingsService.getSettings();

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate dynamic tax
    const isTaxEnabled = settings?.tax?.enabled !== false;
    const taxRate = isTaxEnabled ? (settings?.tax?.rate ?? settings?.taxRate ?? 0) : 0;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));

    // Calculate dynamic shipping
    let shippingAmount = 0;
    const isShippingEnabled = settings?.shipping?.enabled !== false;
    if (isShippingEnabled) {
      const freeShippingThreshold = settings?.shipping?.freeShippingThreshold ?? settings?.freeShippingThreshold ?? 0;
      const defaultShippingRate = settings?.shipping?.defaultRate ?? settings?.shippingFee ?? 0;
      if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) {
        shippingAmount = 0;
      } else {
        shippingAmount = defaultShippingRate;
      }
    }

    // Validate and apply coupon if provided
    let discountAmount = 0;
    let appliedCoupon: any = null;
    if (data.couponCode) {
      const coupon = await Coupon.findOne({ code: data.couponCode.toUpperCase().trim() });
      if (coupon && coupon.isActive) {
        const now = new Date();
        const isNotExpired = !coupon.expiresAt || now <= coupon.expiresAt;
        const isStarted = !coupon.startsAt || now >= coupon.startsAt;
        const withinUsageLimit = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
        const meetsMinOrder = !coupon.minimumOrderValue || subtotal >= coupon.minimumOrderValue;

        if (isNotExpired && isStarted && withinUsageLimit && meetsMinOrder) {
          if (coupon.type === CouponType.PERCENTAGE) {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
              discountAmount = coupon.maximumDiscountAmount;
            }
          } else {
            discountAmount = Math.min(coupon.value, subtotal);
          }
          discountAmount = Number(discountAmount.toFixed(2));
          appliedCoupon = coupon;
        }
      }
    }

    const totalAmount = Number(Math.max(0, subtotal + taxAmount + shippingAmount - discountAmount).toFixed(2));

    // Handle User Account Creation & Linking
    let finalUserId = userId;
    if (!userId) {
      const normalizedEmail = data.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        // Automatically link order to existing account
        finalUserId = existingUser._id.toString();
      } else {
        // Auto-provision user account with a strong password if not explicitly supplied
        const plainPassword = data.password && data.password.trim().length >= 6
          ? data.password.trim()
          : PasswordUtils.generateStrongPassword(14);

        const hashedPassword = await PasswordUtils.hash(plainPassword);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        const newUser = new User({
          email: normalizedEmail,
          password: hashedPassword,
          firstName: data.shippingAddress.firstName,
          lastName: data.shippingAddress.lastName || '',
          phone: data.phone || data.shippingAddress.phone,
          role: 'user',
          isEmailVerified: false,
          emailVerificationToken: hashedVerificationToken,
        });

        await newUser.save();
        finalUserId = newUser._id.toString();

        // Send welcome email with login credentials and account verification link
        const verificationUrl = `${env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
        MailService.sendAccountCreatedEmail(normalizedEmail, plainPassword, verificationUrl)
          .catch((err) => console.error('[OrdersService] Failed to send account creation email:', err));
      }
    }

    // Validate Cash on Delivery availability if chosen
    if (data.paymentMethod === PaymentMethod.COD) {
      const settings = await SettingsService.getSettings();
      const isCodEnabled = settings?.payments?.cashOnDelivery?.enabled ?? true;
      if (!isCodEnabled) {
        throw new AppError('Cash on Delivery is currently disabled by the store.', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Create order
    const order = new Order({
      orderNumber,
      customer: finalUserId,
      sessionId: finalUserId ? undefined : sessionId,
      email: data.email,
      phone: data.phone,
      items: orderItems,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      status: data.paymentMethod === PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
      notes: data.notes,
      couponCode: appliedCoupon ? appliedCoupon.code : data.couponCode,
    });

    await order.save();

    // Increment coupon usage count if applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usageCount: 1 } });
    }

    // Clear cart if not Razorpay (Razorpay cart clear happens after payment verification)
    // Actually, usually we clear it now or on verification. 
    // If we clear now, but payment fails, user has empty cart.
    // If we don't clear now, user sees items in cart while paying.
    // Standard practice: Clear after successful order creation if it's not a payment-mandatory flow, 
    // OR keep it until payment success. 
    // For this app, let's clear it on SUCCESSFUL creation for COD, and on VERIFICATION for Razorpay.
    
    if (data.paymentMethod === PaymentMethod.COD) {
      cart.items = [];
      await cart.save();
    }

    // Handle Razorpay Order Creation
    if (data.paymentMethod === PaymentMethod.RAZORPAY) {
      try {
        const razorpayOrder = await RazorpayService.createOrder(order.totalAmount, order.orderNumber);
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
      } catch (error) {
        // If razorpay order creation fails, we might want to delete the order or mark it failed
        order.status = OrderStatus.CANCELLED;
        order.paymentStatus = PaymentStatus.FAILED;
        await order.save();
        throw new AppError('Failed to initialize payment gateway', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
    }

    // Send order confirmation email (don't await to avoid delaying response)
    MailService.sendOrderConfirmationEmail(order).catch(err => console.error('Failed to send order confirmation email:', err));

    return order;
  }

  public static async verifyRazorpayPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<IOrder> {
    const isVerified = RazorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isVerified) {
      throw new AppError('Invalid payment signature', HTTP_STATUS.BAD_REQUEST);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    order.paymentStatus = PaymentStatus.COMPLETED;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.status = OrderStatus.CONFIRMED;
    await order.save();

    // Send payment received email
    MailService.sendPaymentReceivedEmail(order).catch(err => console.error('Failed to send payment received email:', err));

    // Clear cart now that payment is confirmed
    const query = order.customer ? { user: order.customer } : { sessionId: order.sessionId };
    await Cart.findOneAndUpdate(query, { $set: { items: [] } });

    return order;
  }

  public static async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<IOrder> {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    order.status = status;

    if (status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
      order.paymentStatus = PaymentStatus.COMPLETED;
    } else if (status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, salesCount: -item.quantity },
        });
      }
    }

    await order.save();

    // Send order status update email
    if ([OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(status)) {
      MailService.sendOrderStatusUpdateEmail(order, status).catch(err => console.error('Failed to send order status update email:', err));
    }

    return order;
  }

  public static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentIntentId?: string
  ): Promise<IOrder> {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    order.paymentStatus = paymentStatus;
    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId;
    }

    await order.save();
    return order;
  }

  public static async cancelOrder(orderId: string, userId?: string): Promise<IOrder> {
    const query: any = { _id: orderId };
    if (userId) {
      query.customer = userId;
    }

    const order = await Order.findOne(query);
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
      throw new AppError(MESSAGES.ORDER_CANNOT_BE_CANCELLED, HTTP_STATUS.BAD_REQUEST);
    }

    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }

  public static async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: OrderStatus.PENDING }),
      Order.countDocuments({ status: OrderStatus.PROCESSING }),
      Order.countDocuments({ status: OrderStatus.SHIPPED }),
      Order.countDocuments({ status: OrderStatus.DELIVERED }),
      Order.countDocuments({ status: OrderStatus.CANCELLED }),
      Order.aggregate([
        { $match: { status: { $ne: OrderStatus.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }

  public static async addTrackingNumber(
    orderId: string,
    trackingNumber: string,
    shippingMethod?: string,
    carrier?: string
  ): Promise<IOrder> {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    order.trackingNumber = trackingNumber;
    if (shippingMethod) {
      order.shippingMethod = shippingMethod;
    }
    if (carrier) {
      order.carrier = carrier;
    }

    // Auto-update status to shipped if not already
    if (order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.DELIVERED) {
      order.status = OrderStatus.SHIPPED;
      order.shippedAt = new Date();
    }

    await order.save();

    // Send order status update email
    MailService.sendOrderStatusUpdateEmail(order, OrderStatus.SHIPPED)
      .catch((err) => console.error('[OrdersService] Failed to send shipped update email:', err));

    return order;
  }

  public static async getOrderTracking(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) {
      query.customer = userId;
    }

    const order = await Order.findOne(query).select(
      'orderNumber status trackingNumber carrier shippingMethod shippingAddress createdAt shippedAt deliveredAt'
    );
    
    if (!order) {
      throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      shippingMethod: order.shippingMethod,
      shippingAddress: order.shippingAddress,
      timeline: {
        ordered: order.createdAt,
        shipped: order.shippedAt,
        delivered: order.deliveredAt,
      },
    };
  }

  public static async getOrderInvoice(orderId: string, userId?: string) {
    const order = await this.getOrderById(orderId, userId);
    const settings = await SettingsService.getSettings();

    const taxRate = settings?.tax?.rate ?? 18;
    const taxBreakdown = {
      cgst: order.taxAmount > 0 ? Number((order.taxAmount / 2).toFixed(2)) : 0,
      sgst: order.taxAmount > 0 ? Number((order.taxAmount / 2).toFixed(2)) : 0,
      igst: 0,
      totalTax: order.taxAmount,
      taxRate,
    };

    return {
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      seller: {
        companyName: 'Kangpack Packaging Solutions Pvt. Ltd.',
        gstin: '27AABCK1234F1Z5',
        pan: 'AABCK1234F',
        address: '12 Industrial Area, Phase II',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        email: 'billing@kangpack.in',
        phone: '+91 98765 43210',
      },
      customer: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`.trim(),
        email: order.email,
        phone: order.phone || order.shippingAddress.phone,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress || order.shippingAddress,
      },
      items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku,
        hsnCode: '481910',
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.total,
      })),
      financials: {
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        taxBreakdown,
        shippingAmount: order.shippingAmount,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      status: order.status,
    };
  }

  public static async getUserOrderHistory(userId: string, limit: number = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    const orders = await Order.find({
      $or: [
        { customer: userId },
        { email: user.email, customer: { $exists: false } }
      ]
    })
      .select('orderNumber status totalAmount createdAt items')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return orders;
  }

  private static async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const count = await Order.countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), 1),
        $lt: new Date(year, date.getMonth() + 1, 1),
      },
    });

    return `ORD-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
}
