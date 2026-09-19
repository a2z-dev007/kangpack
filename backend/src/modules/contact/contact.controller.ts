import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { ResponseUtils } from '../../common/utils';
import { HTTP_STATUS } from '../../common/constants';
import { asyncHandler } from '../../common/middlewares/error.middleware';

export class ContactController {
  public static submitContactForm = asyncHandler(async (req: Request, res: Response) => {
    const contact = await ContactService.submitContactForm(req.body);
    res.status(HTTP_STATUS.CREATED).json(
      ResponseUtils.success('Your message has been sent successfully. We will get back to you soon!', contact)
    );
  });

  public static getAllContacts = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search } = req.query;
    const result = await ContactService.getContactSubmissions({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string,
      search: search as string,
    });

    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Contact inquiries retrieved successfully', result.data, result.pagination)
    );
  });

  public static getContactStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await ContactService.getContactStats();
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Contact statistics retrieved successfully', stats)
    );
  });

  public static getContactById = asyncHandler(async (req: Request, res: Response) => {
    const contact = await ContactService.getContactById(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Contact inquiry retrieved successfully', contact)
    );
  });

  public static updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
    const contact = await ContactService.updateContactStatus(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Contact status updated successfully', contact)
    );
  });

  public static deleteContact = asyncHandler(async (req: Request, res: Response) => {
    await ContactService.deleteContact(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      ResponseUtils.success('Contact inquiry deleted successfully')
    );
  });
}
