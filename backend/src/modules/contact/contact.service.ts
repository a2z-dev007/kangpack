import { Contact, ContactStatus, IContact } from '../../database/models/Contact';
import { MailService } from '../../common/services/mail.service';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS } from '../../common/constants';
import { PaginationUtils } from '../../common/utils';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactQueryFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class ContactService {
  /**
   * Submit contact form, store in database, and trigger email notification
   */
  public static async submitContactForm(data: ContactFormData): Promise<IContact> {
    const { firstName, lastName, email, phone, message } = data;

    // 1. Store submission in Database
    const contact = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      message: message.trim(),
      status: ContactStatus.UNREAD,
    });

    // 2. Send email notification asynchronously without blocking
    const name = `${firstName} ${lastName}`.trim();
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #6B4A2D; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">New Contact Inquiry Received</h2>
        </div>
        <div style="padding: 24px; color: #334155;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #6B4A2D;">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Received At:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #6B4A2D; border-radius: 4px; margin-top: 8px; font-size: 14px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          Kangpack Admin Notification
        </div>
      </div>
    `;

    const adminEmail = process.env.CONTACT_EMAIL || process.env.FROM_EMAIL || 'support@kangpack.in';
    MailService.sendEmail(adminEmail, `New Contact Inquiry from ${name}`, adminHtml).catch((err) => {
      console.warn('[ContactService] Failed to send admin notification email:', err.message);
    });

    return contact;
  }

  /**
   * Get paginated contact requests for admin with search & status filters
   */
  public static async getContactSubmissions(filters: ContactQueryFilters = {}) {
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
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex },
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(query),
    ]);

    return {
      data: contacts,
      pagination: PaginationUtils.calculatePagination(page, limit, total),
    };
  }

  /**
   * Get single contact inquiry by ID
   */
  public static async getContactById(id: string): Promise<IContact> {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new AppError('Contact request not found', HTTP_STATUS.NOT_FOUND);
    }
    return contact;
  }

  /**
   * Update status or notes on a contact request
   */
  public static async updateContactStatus(
    id: string,
    updateData: { status?: ContactStatus; adminNotes?: string }
  ): Promise<IContact> {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new AppError('Contact request not found', HTTP_STATUS.NOT_FOUND);
    }

    if (updateData.status) {
      contact.status = updateData.status;
      if (updateData.status === ContactStatus.REPLIED) {
        contact.repliedAt = new Date();
      }
    }

    if (updateData.adminNotes !== undefined) {
      contact.adminNotes = updateData.adminNotes;
    }

    await contact.save();
    return contact;
  }

  /**
   * Delete a contact request
   */
  public static async deleteContact(id: string): Promise<void> {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw new AppError('Contact request not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Get aggregate stats for contact requests (Total, Unread, Replied, Archived)
   */
  public static async getContactStats() {
    const [total, unread, read, replied, archived] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: ContactStatus.UNREAD }),
      Contact.countDocuments({ status: ContactStatus.READ }),
      Contact.countDocuments({ status: ContactStatus.REPLIED }),
      Contact.countDocuments({ status: ContactStatus.ARCHIVED }),
    ]);

    return {
      total,
      unread,
      read,
      replied,
      archived,
    };
  }
}
