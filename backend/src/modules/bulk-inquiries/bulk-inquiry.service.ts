import { BulkInquiry, BulkInquiryStatus, IBulkInquiry } from '../../database/models/BulkInquiry';
import { Settings } from '../../database/models/Settings';
import { MailService } from '../../common/services/mail.service';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS } from '../../common/constants';
import { PaginationUtils } from '../../common/utils';

export interface BulkInquiryFormData {
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
  customizationRequired?: boolean;
  message?: string;
  estimatedBudget?: string;
}

export interface BulkInquiryQueryFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class BulkInquiryService {
  /**
   * Submit a new bulk inquiry, save to DB, and send admin email notification to support@kangpack.in
   */
  public static async submitInquiry(data: BulkInquiryFormData): Promise<IBulkInquiry> {
    const {
      name,
      companyName,
      email,
      phone,
      productInterest,
      quantity,
      timeline,
      city,
      state,
      pincode,
      customizationRequired,
      message,
      estimatedBudget,
    } = data;

    const inquiry = await BulkInquiry.create({
      name: name.trim(),
      companyName: companyName?.trim() || '',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      productInterest: productInterest.trim(),
      quantity: quantity.trim(),
      timeline: timeline?.trim() || 'Flexible',
      city: city?.trim() || '',
      state: state?.trim() || '',
      pincode: pincode?.trim() || '',
      customizationRequired: Boolean(customizationRequired),
      message: message?.trim() || '',
      estimatedBudget: estimatedBudget?.trim() || '',
      status: BulkInquiryStatus.PENDING,
    });

    // 1. Resolve Admin recipient email (from Settings or fallback support@kangpack.in)
    let adminEmail = 'support@kangpack.in';
    try {
      const settings = await Settings.findOne().lean();
      if (settings?.contactInfo?.email) {
        adminEmail = settings.contactInfo.email;
      } else if (process.env.CONTACT_EMAIL || process.env.FROM_EMAIL) {
        adminEmail = process.env.CONTACT_EMAIL || process.env.FROM_EMAIL || 'support@kangpack.in';
      }
    } catch {
      adminEmail = process.env.CONTACT_EMAIL || process.env.FROM_EMAIL || 'support@kangpack.in';
    }

    const location = [city, state, pincode].filter(Boolean).join(', ') || 'Not specified';
    const refCode = inquiry._id.toString().slice(-6).toUpperCase();

    // 2. Admin Alert Email HTML Template
    const adminHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b;">
        <div style="background-color: #6B4A2D; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">📦 New Bulk Order Inquiry</h2>
          <p style="margin: 6px 0 0 0; opacity: 0.85; font-size: 13px;">Reference ID: #BLK-${refCode} · Kangpack Commercial Desk</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 9px 0; color: #64748b; width: 150px;"><strong>Client Name:</strong></td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Company / Org:</strong></td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">${companyName || 'Individual / Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Business Email:</strong></td>
              <td style="padding: 9px 0;"><a href="mailto:${email}" style="color: #6B4A2D; text-decoration: none; font-weight: bold;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Phone / WhatsApp:</strong></td>
              <td style="padding: 9px 0;"><a href="tel:${phone}" style="color: #6B4A2D; text-decoration: none; font-weight: bold;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Product Interest:</strong></td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">${productInterest}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Estimated Quantity:</strong></td>
              <td style="padding: 9px 0; color: #6B4A2D; font-weight: bold; font-size: 15px;">${quantity}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Target Timeline:</strong></td>
              <td style="padding: 9px 0; color: #0f172a;">${timeline || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Delivery Location:</strong></td>
              <td style="padding: 9px 0; color: #0f172a;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Custom Branding:</strong></td>
              <td style="padding: 9px 0; color: #0f172a;">${customizationRequired ? '✅ Yes (Custom Corporate Logo / Bespoke Finish)' : 'No'}</td>
            </tr>
            ${
              estimatedBudget
                ? `
            <tr>
              <td style="padding: 9px 0; color: #64748b;"><strong>Estimated Budget:</strong></td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 500;">${estimatedBudget}</td>
            </tr>`
                : ''
            }
          </table>

          ${
            message
              ? `
            <div style="margin-top: 20px; border-top: 1px solid #f1f5f9; pt: 16px;">
              <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Client Special Requirements:</strong>
              <div style="background-color: #f8fafc; padding: 14px 18px; border-left: 4px solid #6B4A2D; border-radius: 4px; margin-top: 8px; font-size: 14px; line-height: 1.6; color: #334155;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `
              : ''
          }
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Log into the Kangpack Admin Portal (<a href="https://kangpack.in/admin/bulk-inquiries" style="color: #6B4A2D; font-weight: bold;">/admin/bulk-inquiries</a>) to follow up and manage this lead.
        </div>
      </div>
    `;

    // 3. Customer Confirmation Email HTML Template
    const customerHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3E2A1D; color: white; padding: 36px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px;">Bulk Inquiry Received</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.85; font-size: 13px;">Kangpack Commercial Sales Team</p>
        </div>
        <div style="padding: 32px 28px; background-color: #F9F7F4;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your interest in Kangpack workstations for your organization. We have successfully received your bulk order request (Reference: <strong>#BLK-${refCode}</strong>).</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;"><strong>Order Summary:</strong></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Product of Interest:</strong> ${productInterest}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Estimated Quantity:</strong> ${quantity}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Delivery Timeline:</strong> ${timeline || 'Flexible'}</p>
            ${customizationRequired ? '<p style="margin: 4px 0; font-size: 14px; color: #6B4A2D;"><strong>Customization:</strong> Logo Branding Requested</p>' : ''}
          </div>

          <p>Our dedicated B2B commercial specialist is reviewing your requirement and will contact you via email or phone within <strong>24 to 48 business hours</strong> with a customized quote and sample options.</p>

          <p style="margin-top: 24px; font-size: 13px; color: #666;">
            If you need urgent assistance, you can reach our commercial desk directly at <a href="mailto:support@kangpack.in" style="color: #6B4A2D; font-weight: bold;">support@kangpack.in</a>.
          </p>
        </div>
        <div style="background-color: #3E2A1D; color: #ffffff80; padding: 16px; text-align: center; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Kangpack Workstations. All rights reserved.
        </div>
      </div>
    `;

    // 4. Send emails asynchronously
    const subjectPrefix = companyName ? `${companyName} (${name})` : name;
    MailService.sendEmail(
      adminEmail,
      `[Bulk Order Lead] New Inquiry from ${subjectPrefix} - ${quantity}`,
      adminHtml
    ).catch((err) => {
      console.warn('[BulkInquiryService] Failed to send admin notification email:', err.message);
    });

    MailService.sendEmail(
      email.trim(),
      `Kangpack: We've Received Your Bulk Order Inquiry (#BLK-${refCode})`,
      customerHtml
    ).catch((err) => {
      console.warn('[BulkInquiryService] Failed to send customer confirmation email:', err.message);
    });

    return inquiry;
  }

  /**
   * Get paginated inquiries for admin with status and search filters
   */
  public static async getInquiries(filters: BulkInquiryQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
    const skip = PaginationUtils.getSkip(page, limit);

    const query: any = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { companyName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { productInterest: searchRegex },
        { city: searchRegex },
        { message: searchRegex },
      ];
    }

    const [inquiries, total] = await Promise.all([
      BulkInquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BulkInquiry.countDocuments(query),
    ]);

    return {
      data: inquiries,
      pagination: PaginationUtils.calculatePagination(page, limit, total),
    };
  }

  /**
   * Get single bulk inquiry by ID
   */
  public static async getInquiryById(id: string): Promise<IBulkInquiry> {
    const inquiry = await BulkInquiry.findById(id);
    if (!inquiry) {
      throw new AppError('Bulk inquiry not found', HTTP_STATUS.NOT_FOUND);
    }
    return inquiry;
  }

  /**
   * Update status or notes on a bulk inquiry
   */
  public static async updateInquiryStatus(
    id: string,
    updateData: {
      status?: BulkInquiryStatus;
      adminNotes?: string;
      estimatedBudget?: string;
    }
  ): Promise<IBulkInquiry> {
    const inquiry = await BulkInquiry.findById(id);
    if (!inquiry) {
      throw new AppError('Bulk inquiry not found', HTTP_STATUS.NOT_FOUND);
    }

    if (updateData.status) {
      inquiry.status = updateData.status;
      if (updateData.status === BulkInquiryStatus.CONTACTED && !inquiry.contactedAt) {
        inquiry.contactedAt = new Date();
      } else if (updateData.status === BulkInquiryStatus.QUOTED && !inquiry.quotedAt) {
        inquiry.quotedAt = new Date();
      } else if (
        (updateData.status === BulkInquiryStatus.CLOSED ||
          updateData.status === BulkInquiryStatus.CANCELLED) &&
        !inquiry.closedAt
      ) {
        inquiry.closedAt = new Date();
      }
    }

    if (updateData.adminNotes !== undefined) {
      inquiry.adminNotes = updateData.adminNotes;
    }

    if (updateData.estimatedBudget !== undefined) {
      inquiry.estimatedBudget = updateData.estimatedBudget;
    }

    await inquiry.save();
    return inquiry;
  }

  /**
   * Delete a bulk inquiry
   */
  public static async deleteInquiry(id: string): Promise<void> {
    const inquiry = await BulkInquiry.findByIdAndDelete(id);
    if (!inquiry) {
      throw new AppError('Bulk inquiry not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Get aggregated statistics for dashboard/admin metrics
   */
  public static async getInquiryStats() {
    const [total, pending, inReview, contacted, quoted, closed, cancelled] = await Promise.all([
      BulkInquiry.countDocuments(),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.PENDING }),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.IN_REVIEW }),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.CONTACTED }),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.QUOTED }),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.CLOSED }),
      BulkInquiry.countDocuments({ status: BulkInquiryStatus.CANCELLED }),
    ]);

    return {
      total,
      pending,
      inReview,
      contacted,
      quoted,
      closed,
      cancelled,
    };
  }
}
