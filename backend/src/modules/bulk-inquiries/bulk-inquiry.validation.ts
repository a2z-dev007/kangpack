import { z } from 'zod';
import { BulkInquiryStatus } from '../../database/models/BulkInquiry';

export const submitBulkInquirySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Full name is required').max(100),
    companyName: z.string().max(120).optional().or(z.literal('')),
    email: z.string().email('Valid work/business email is required'),
    phone: z.string().min(6, 'Valid phone number is required').max(25),
    productInterest: z.string().min(1, 'Product interest is required'),
    quantity: z.string().min(1, 'Quantity is required'),
    timeline: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),
    customizationRequired: z.boolean().optional().default(false),
    message: z.string().max(3000).optional().or(z.literal('')),
    estimatedBudget: z.string().optional().or(z.literal('')),
  }),
});

export const updateBulkInquiryStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BulkInquiryStatus).optional(),
    adminNotes: z.string().optional(),
    estimatedBudget: z.string().optional(),
  }),
});

export const validateSchema = (schema: any) => (req: any, res: any, next: any) => {
  try {
    const { body, query, params } = req;
    schema.parse({ body, query, params });
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Validation Error',
      errors: error.errors,
    });
  }
};
