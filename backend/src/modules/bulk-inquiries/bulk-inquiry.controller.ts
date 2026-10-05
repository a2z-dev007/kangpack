import { Request, Response } from 'express';
import { BulkInquiryService } from './bulk-inquiry.service';
import { ResponseUtils } from '../../common/utils';
import { HTTP_STATUS } from '../../common/constants';
import { asyncHandler } from '../../common/middlewares/error.middleware';

export class BulkInquiryController {
  public static submitInquiry = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await BulkInquiryService.submitInquiry(req.body);
    res.status(HTTP_STATUS.CREATED).json(
      ResponseUtils.success(
        'Thank you! Your bulk order inquiry has been received. Our corporate team will contact you shortly.',
        inquiry
      )
    );
  });

  public static getAllInquiries = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search } = req.query;
    const result = await BulkInquiryService.getInquiries({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string,
      search: search as string,
    });

    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Bulk inquiries retrieved successfully', result.data, result.pagination)
    );
  });

  public static getInquiryStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await BulkInquiryService.getInquiryStats();
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Bulk inquiry statistics retrieved successfully', stats)
    );
  });

  public static getInquiryById = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await BulkInquiryService.getInquiryById(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Bulk inquiry retrieved successfully', inquiry)
    );
  });

  public static updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await BulkInquiryService.updateInquiryStatus(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Bulk inquiry updated successfully', inquiry)
    );
  });

  public static deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
    await BulkInquiryService.deleteInquiry(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Bulk inquiry deleted successfully')
    );
  });
}
