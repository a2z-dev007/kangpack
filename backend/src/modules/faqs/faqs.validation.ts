import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string({ required_error: 'Question is required' }).trim().min(3, 'Question must be at least 3 characters').max(500),
    answer: z.string({ required_error: 'Answer is required' }).trim().min(3, 'Answer must be at least 3 characters').max(5000),
    category: z.string().trim().optional().default('General'),
    order: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateFaqSchema = z.object({
  body: z.object({
    question: z.string().trim().min(3, 'Question must be at least 3 characters').max(500).optional(),
    answer: z.string().trim().min(3, 'Answer must be at least 3 characters').max(5000).optional(),
    category: z.string().trim().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const reorderFaqsSchema = z.object({
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
    if (parsed.body) req.body = parsed.body;
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
