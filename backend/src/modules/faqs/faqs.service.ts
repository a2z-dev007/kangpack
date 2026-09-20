import mongoose from 'mongoose';
import { Faq, IFaq } from '../../database/models/Faq';
import { PaginationUtils } from '../../common/utils';
import { PaginationInfo } from '../../common/types';

export interface GetFaqsAdminOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface FaqStats {
  total: number;
  active: number;
  inactive: number;
  categories: string[];
}

export class FaqsService {
  async createFaq(data: Partial<IFaq>): Promise<IFaq> {
    // If order is not specified or 0, calculate next order
    if (data.order === undefined || data.order === 0) {
      const highestOrder = await Faq.findOne().sort({ order: -1 }).select('order');
      data.order = highestOrder ? (highestOrder.order || 0) + 1 : 1;
    }
    return await Faq.create(data);
  }

  async getAllFaqs(category?: string): Promise<IFaq[]> {
    const filter: Record<string, any> = { isActive: true };
    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }
    return await Faq.find(filter).sort({ order: 1, createdAt: 1 });
  }

  async getFaqById(id: string): Promise<IFaq | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Faq.findById(id);
  }

  async updateFaq(id: string, data: Partial<IFaq>): Promise<IFaq | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Faq.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async deleteFaq(id: string): Promise<IFaq | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Faq.findByIdAndDelete(id);
  }

  async toggleStatus(id: string): Promise<IFaq | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const faq = await Faq.findById(id);
    if (!faq) return null;
    faq.isActive = !faq.isActive;
    return await faq.save();
  }

  async reorderFaqs(items: { id: string; order: number }[]): Promise<void> {
    const bulkOps = items
      .filter(item => mongoose.Types.ObjectId.isValid(item.id))
      .map(item => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item.id) },
          update: { $set: { order: item.order } },
        },
      }));

    if (bulkOps.length > 0) {
      await Faq.bulkWrite(bulkOps);
    }
  }

  async getAllFaqsAdmin(options: GetFaqsAdminOptions = {}): Promise<{ faqs: IFaq[]; pagination: PaginationInfo }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = PaginationUtils.getSkip(page, limit);

    const filter: Record<string, any> = {};

    if (options.isActive !== undefined) {
      filter.isActive = options.isActive;
    }

    if (options.category && options.category !== 'all') {
      filter.category = new RegExp(`^${options.category}$`, 'i');
    }

    if (options.search && options.search.trim()) {
      const searchRegex = new RegExp(options.search.trim(), 'i');
      filter.$or = [
        { question: searchRegex },
        { answer: searchRegex },
        { category: searchRegex },
      ];
    }

    const [faqs, total] = await Promise.all([
      Faq.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Faq.countDocuments(filter),
    ]);

    const pagination = PaginationUtils.calculatePagination(page, limit, total);
    return { faqs, pagination };
  }

  async getFaqStats(): Promise<FaqStats> {
    const [total, active, categories] = await Promise.all([
      Faq.countDocuments(),
      Faq.countDocuments({ isActive: true }),
      Faq.distinct('category'),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      categories: categories.filter(Boolean),
    };
  }
}
