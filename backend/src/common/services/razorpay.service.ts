import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../config/env';

export class RazorpayService {
  private static instance: Razorpay;

  public static getKeyId(): string {
    return env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
  }

  private static getKeySecret(): string {
    return env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
  }

  private static getInstance() {
    if (!this.instance) {
      const key_id = this.getKeyId();
      const key_secret = this.getKeySecret();
      if (!key_id || !key_secret) {
        console.warn('Razorpay keys are missing in environment variables');
      }
      this.instance = new Razorpay({
        key_id,
        key_secret,
      });
    }
    return this.instance;
  }

  public static async createOrder(amount: number, receipt: string, currency: string = 'INR') {
    const key_id = this.getKeyId();
    const key_secret = this.getKeySecret();

    // If keys are missing in development, generate simulated order so checkout flow is testable
    if (!key_id || !key_secret) {
      console.warn('[RazorpayService] RAZORPAY_KEY_SECRET or KEY_ID not configured. Generating simulated development order.');
      return {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        entity: 'order',
        amount: Math.round(amount * 100),
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency,
        receipt,
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
      } as any;
    }

    const razorpay = this.getInstance();
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt,
    };

    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      if (env.NODE_ENV !== 'production') {
        console.warn('[RazorpayService] Razorpay API call failed in development. Falling back to simulated order.');
        return {
          id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          entity: 'order',
          amount: Math.round(amount * 100),
          currency,
          receipt,
          status: 'created',
        } as any;
      }
      throw error;
    }
  }

  public static verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ): boolean {
    const isDev = env.NODE_ENV === 'development';

    if (isDev && (!signature || signature === 'signature_ok' || razorpayOrderId?.startsWith('order_mock_'))) {
      console.warn('[RazorpayService] Development mock signature bypass active');
      return true;
    }

    if (!signature || signature === 'signature_ok') {
      return false;
    }

    const key_secret = this.getKeySecret();
    if (!key_secret) {
      if (isDev) return true;
      console.error('[RazorpayService] Cannot verify signature: RAZORPAY_KEY_SECRET is missing');
      return false;
    }

    try {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === signature;
    } catch (e) {
      console.error('[RazorpayService] Signature verification error:', e);
      return false;
    }
  }

  public static async refundPayment(paymentId: string, amount: number, notes?: any) {
    const key_id = this.getKeyId();
    const key_secret = this.getKeySecret();
    if (!key_id || !key_secret) {
      if (env.NODE_ENV !== 'production') {
        console.warn('[RazorpayService] Missing keys in dev; simulating refund');
        return { id: `rfnd_mock_${Date.now()}`, amount: Math.round(amount * 100), status: 'processed' } as any;
      }
      throw new Error('Razorpay keys not configured');
    }
    const razorpay = this.getInstance();
    return razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100),
      notes,
    });
  }

  public static verifyWebhookSignature(payload: string, signature: string, secret?: string): boolean {
    const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || this.getKeySecret();
    if (!webhookSecret) {
      if (env.NODE_ENV !== 'production') return true;
      return false;
    }
    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');
      return expectedSignature === signature;
    } catch (e) {
      console.error('[RazorpayService] Webhook signature verification error:', e);
      return false;
    }
  }
}
