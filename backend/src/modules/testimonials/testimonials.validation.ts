import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters').max(100),
    role: z.string({ required_error: 'Role is required' }).trim().min(2, 'Role must be at least 2 characters').max(100),
    company: z.string().trim().max(100).optional().default(''),
    content: z.string({ required_error: 'Content is required' }).trim().min(5, 'Content must be at least 5 characters').max(2000),
    image: z.string().trim().optional().default(''),
    avatar: z.string().trim().optional(), // alias support
    text: z.string().trim().optional(), // alias support
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional().default(5),
    order: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateTestimonialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
    role: z.string().trim().min(2, 'Role must be at least 2 characters').max(100).optional(),
    company: z.string().trim().max(100).optional(),
    content: z.string().trim().min(5, 'Content must be at least 5 characters').max(2000).optional(),
    image: z.string().trim().optional(),
    avatar: z.string().trim().optional(),
    text: z.string().trim().optional(),
    rating: z.number().min(1).max(5).optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const reorderTestimonialsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().min(1, 'ID is required'),
        order: z.number().int('Order must be an integer'),
      })
    ).min(1, 'Items array cannot be empty'),
  }),
});

export const validateSchema = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as any;
    if (parsed.body) {
      // Normalize aliases: text -> content, avatar -> image
      if (!parsed.body.content && parsed.body.text) {
        parsed.body.content = parsed.body.text;
      }
      if (!parsed.body.image && parsed.body.avatar) {
        parsed.body.image = parsed.body.avatar;
      }
      req.body = parsed.body;
    }
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || 'Validation Error',
      errors: error.errors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};
