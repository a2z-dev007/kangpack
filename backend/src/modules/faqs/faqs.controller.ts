import { Request, Response } from 'express';
import { FaqsService } from './faqs.service';
import { ResponseUtils } from '../../common/utils';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { asyncHandler, AppError } from '../../common/middlewares/error.middleware';

const faqsService = new FaqsService();

export class FaqsController {
  public static getAllFaqs = asyncHandler(async (req: Request, res: Response) => {
    const category = req.query.category as string;
    const faqs = await faqsService.getAllFaqs(category);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, faqs)
    );
  });

  public static getFaqById = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqsService.getFaqById(req.params.id);
    if (!faq) {
      throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, faq)
    );
  });

  public static getAllFaqsAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search, category, isActive } = req.query;
    const options: any = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search: search as string,
      category: category as string,
    };
    if (isActive !== undefined) {
      options.isActive = isActive === 'true';
    }

    const { faqs, pagination } = await faqsService.getAllFaqsAdmin(options);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.FETCHED_SUCCESS, faqs, pagination)
    );
  });

  public static getFaqStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await faqsService.getFaqStats();
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('FAQ statistics retrieved successfully', stats)
    );
  });

  public static createFaq = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqsService.createFaq(req.body);
    res.status(HTTP_STATUS.CREATED).json(
      ResponseUtils.success(MESSAGES.CREATED_SUCCESS, faq)
    );
  });

  public static updateFaq = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqsService.updateFaq(req.params.id, req.body);
    if (!faq) {
      throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.UPDATED_SUCCESS, faq)
    );
  });

  public static toggleFaqStatus = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqsService.toggleStatus(req.params.id);
    if (!faq) {
      throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(`FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully`, faq)
    );
  });

  public static reorderFaqs = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body;
    await faqsService.reorderFaqs(items);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('FAQs reordered successfully')
    );
  });

  public static deleteFaq = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqsService.deleteFaq(req.params.id);
    if (!faq) {
      throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success(MESSAGES.DELETED_SUCCESS)
    );
  });
}
