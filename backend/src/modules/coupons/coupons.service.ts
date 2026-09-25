import { Coupon, ICoupon } from '../../database';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { PaginationUtils } from '../../common/utils';
import { PaginationQuery, FilterQuery, CouponType } from '../../common/types';

export interface CreateCouponData {
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  userUsageLimit?: number;
  isActive?: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedCategories?: string[];
  excludedProducts?: string[];
}

export class CouponsService {
  public static async getCoupons(pagination: PaginationQuery, filters: FilterQuery) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
    const { search, status } = filters;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = PaginationUtils.getSkip(page, limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(query),
    ]);

    const paginationInfo = PaginationUtils.calculatePagination(page, limit, total);

    return { coupons, pagination: paginationInfo };
  }

  public static async getPublicCoupons() {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
      $and: [
        {
          $or: [
            { startsAt: { $exists: false } },
            { startsAt: null },
            { startsAt: { $lte: now } },
          ],
        },
        {
          $or: [
            { usageLimit: { $exists: false } },
            { usageLimit: null },
            { $expr: { $lt: ['$usageCount', '$usageLimit'] } },
          ],
        },
      ],
    })
      .select('code name description type value minimumOrderValue maximumDiscountAmount expiresAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return coupons;
  }

  public static async getCouponById(couponId: string): Promise<ICoupon> {
    const coupon = await Coupon.findById(couponId)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludedCategories', 'name')
      .populate('excludedProducts', 'name');
    
    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
    }

    return coupon;
  }

  public static async getCouponByCode(code: string): Promise<ICoupon> {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      throw new AppError(MESSAGES.INVALID_COUPON, HTTP_STATUS.NOT_FOUND);
    }

    return coupon;
  }

  public static async validateCoupon(
    code: string,
    orderValue: number,
    productIds: string[],
    categoryIds: string[]
  ): Promise<{ valid: boolean; discount: number; message?: string }> {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Coupon not found' };
    }

    // Check if active
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'Coupon is not active' };
    }

    // Check dates
    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return { valid: false, discount: 0, message: 'Coupon not yet valid' };
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return { valid: false, discount: 0, message: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }

    // Check minimum order value
    if (coupon.minimumOrderValue && orderValue < coupon.minimumOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ${coupon.minimumOrderValue} required`,
      };
    }

    // Check applicable products/categories
    if (coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some(id =>
        coupon.applicableProducts.some(p => p.toString() === id)
      );
      if (!hasApplicableProduct) {
        return { valid: false, discount: 0, message: 'Coupon not applicable to cart items' };
      }
    }

    if (coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categoryIds.some(id =>
        coupon.applicableCategories.some(c => c.toString() === id)
      );
      if (!hasApplicableCategory) {
        return { valid: false, discount: 0, message: 'Coupon not applicable to cart items' };
      }
    }

    // Check excluded products/categories
    if (coupon.excludedProducts.length > 0) {
      const hasExcludedProduct = productIds.some(id =>
        coupon.excludedProducts.some(p => p.toString() === id)
      );
      if (hasExcludedProduct) {
        return { valid: false, discount: 0, message: 'Coupon not applicable to some cart items' };
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
      discount = (orderValue * coupon.value) / 100;
      if (coupon.maximumDiscountAmount) {
        discount = Math.min(discount, coupon.maximumDiscountAmount);
      }
    } else if (
      coupon.type === CouponType.FIXED_AMOUNT ||
      (coupon.type as string) === 'fixed' ||
      (coupon.type as string) === 'fixed_amount'
    ) {
      discount = coupon.value;
    } else if (
      coupon.type === CouponType.FREE_SHIPPING ||
      (coupon.type as string) === 'free_shipping'
    ) {
      discount = coupon.value || 0;
    }

    return { valid: true, discount, message: 'Coupon applied successfully' };
  }

  public static async createCoupon(data: CreateCouponData | any): Promise<ICoupon> {
    const code = (data.code || '').trim().toUpperCase();
    if (!code) {
      throw new AppError('Coupon code is required', HTTP_STATUS.BAD_REQUEST);
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new AppError('Coupon code already exists', HTTP_STATUS.CONFLICT);
    }

    const payload: any = {
      ...data,
      code,
      name: data.name || code,
      type: data.type === 'fixed' ? CouponType.FIXED_AMOUNT : data.type,
      minimumOrderValue: data.minimumOrderValue ?? data.minOrderAmount ?? 0,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    };

    const coupon = new Coupon(payload);
    await coupon.save();
    return coupon;
  }

  public static async updateCoupon(
    couponId: string,
    data: Partial<CreateCouponData> | any
  ): Promise<ICoupon> {
    const payload: any = { ...data };

    if (payload.code) {
      const code = payload.code.trim().toUpperCase();
      const existingCoupon = await Coupon.findOne({
        code,
        _id: { $ne: couponId },
      });
      if (existingCoupon) {
        throw new AppError('Coupon code already exists', HTTP_STATUS.CONFLICT);
      }
      payload.code = code;
    }

    if (payload.type === 'fixed') {
      payload.type = CouponType.FIXED_AMOUNT;
    }

    if (payload.minOrderAmount !== undefined && payload.minimumOrderValue === undefined) {
      payload.minimumOrderValue = Number(payload.minOrderAmount) || 0;
    }

    if (payload.usageLimit !== undefined) {
      payload.usageLimit = payload.usageLimit ? Number(payload.usageLimit) : undefined;
    }

    if (payload.expiresAt === '' || payload.expiresAt === null) {
      payload.expiresAt = undefined;
    } else if (payload.expiresAt) {
      payload.expiresAt = new Date(payload.expiresAt);
    }

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
    }

    return coupon;
  }

  public static async deleteCoupon(couponId: string): Promise<void> {
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  public static async incrementUsage(couponId: string): Promise<void> {
    await Coupon.findByIdAndUpdate(couponId, { $inc: { usageCount: 1 } });
  }
}
