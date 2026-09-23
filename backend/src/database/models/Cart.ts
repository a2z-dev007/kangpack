import mongoose, { Document, Schema, Types } from 'mongoose';
import { toFullImageUrl } from '../../common/utils';

export interface ICartItem {
  product: string;
  variant?: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user?: string;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  itemCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId as any,
    ref: 'Product',
    required: true,
  },
  variant: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
  },
  sessionId: {
    type: String,
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expireAfterSeconds: 0 },
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      if (Array.isArray(ret.items)) {
        ret.items = ret.items.map((item: any) => {
          if (item?.product && typeof item.product === 'object' && Array.isArray(item.product.images)) {
            item.product.images = item.product.images.map((img: string) => toFullImageUrl(img));
          }
          return item;
        });
      }
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      if (Array.isArray(ret.items)) {
        ret.items = ret.items.map((item: any) => {
          if (item?.product && typeof item.product === 'object' && Array.isArray(item.product.images)) {
            item.product.images = item.product.images.map((img: string) => toFullImageUrl(img));
          }
          return item;
        });
      }
      return ret;
    },
  },
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

// Ensure either user or sessionId is provided
cartSchema.pre('save', function (this: ICart, next) {
  if (!this.user && !this.sessionId) {
    return next(new Error('Either user or sessionId must be provided'));
  }
  next();
});

// Calculate subtotal and item count before saving
cartSchema.pre('save', function (this: ICart, next) {
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
  next();
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);