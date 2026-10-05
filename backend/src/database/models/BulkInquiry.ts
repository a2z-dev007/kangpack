import mongoose, { Document, Schema } from 'mongoose';

export enum BulkInquiryStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  CONTACTED = 'contacted',
  QUOTED = 'quoted',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export interface IBulkInquiry extends Document {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  productInterest: string;
  quantity: string;
  timeline?: string;
  city?: string;
  state?: string;
  pincode?: string;
  customizationRequired: boolean;
  message?: string;
  status: BulkInquiryStatus;
  adminNotes?: string;
  estimatedBudget?: string;
  contactedAt?: Date;
  quotedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bulkInquirySchema = new Schema<IBulkInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [25, 'Phone number cannot exceed 25 characters'],
    },
    productInterest: {
      type: String,
      required: [true, 'Product of interest is required'],
      trim: true,
      default: 'Smart Mobile Workstation',
    },
    quantity: {
      type: String,
      required: [true, 'Estimated quantity is required'],
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
      default: 'Flexible',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    customizationRequired: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(BulkInquiryStatus),
      default: BulkInquiryStatus.PENDING,
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    estimatedBudget: {
      type: String,
      default: '',
    },
    contactedAt: {
      type: Date,
    },
    quotedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Search and sorting indexes
bulkInquirySchema.index({ createdAt: -1 });
bulkInquirySchema.index({ email: 1 });
bulkInquirySchema.index({ phone: 1 });
bulkInquirySchema.index({ status: 1 });
bulkInquirySchema.index({ companyName: 1 });

export const BulkInquiry = mongoose.model<IBulkInquiry>('BulkInquiry', bulkInquirySchema);
