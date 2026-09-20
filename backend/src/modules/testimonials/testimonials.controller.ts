import { Request, Response } from 'express';
import { TestimonialsService } from './testimonials.service';
import { ResponseUtils } from '../../common/utils';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { asyncHandler, AppError } from '../../common/middlewares/error.middleware';

const testimonialsService = new TestimonialsService();

export class TestimonialsController {
  public static getAllTestimonials = asyncHandler(async (req: Request, res: Response) => {
    const testimonials = await testimonialsService.getAllTestimonials();
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, testimonials)
    );
  });

  public static getTestimonialById = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.getTestimonialById(req.params.id);
    if (!testimonial) {
      throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, testimonial)
    );
  });

  public static getAllTestimonialsAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search, rating, isActive } = req.query;
    const options: any = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search: search as string,
      rating: rating ? Number(rating) : undefined,
    };
    if (isActive !== undefined) {
      options.isActive = isActive === 'true';
    }

    const { testimonials, pagination } = await testimonialsService.getAllTestimonialsAdmin(options);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, testimonials, pagination)
    );
  });

  public static getTestimonialStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await testimonialsService.getTestimonialStats();
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Testimonial statistics retrieved successfully', stats)
    );
  });

  public static createTestimonial = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.createTestimonial(req.body);
    res.status(HTTP_STATUS.CREATED).json(
      ResponseUtils.success(MESSAGES.CREATED_SUCCESS, testimonial)
    );
  });

  public static updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.updateTestimonial(req.params.id, req.body);
    if (!testimonial) {
      throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.UPDATED_SUCCESS, testimonial)
    );
  });

  public static toggleTestimonialStatus = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.toggleStatus(req.params.id);
    if (!testimonial) {
      throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(`Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`, testimonial)
    );
  });

  public static reorderTestimonials = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body;
    await testimonialsService.reorderTestimonials(items);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Testimonials reordered successfully')
    );
  });

  public static deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.deleteTestimonial(req.params.id);
    if (!testimonial) {
      throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.DELETED_SUCCESS)
    );
  });
}
