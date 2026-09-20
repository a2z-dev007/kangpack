import mongoose from 'mongoose';
import { Testimonial, ITestimonial } from '../../database/models/Testimonial';
import { PaginationUtils } from '../../common/utils';
import { PaginationInfo } from '../../common/types';

export interface GetTestimonialsAdminOptions {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  isActive?: boolean;
}

export interface TestimonialStats {
  total: number;
  active: number;
  inactive: number;
  averageRating: number;
}

export class TestimonialsService {
  async createTestimonial(data: Partial<ITestimonial>): Promise<ITestimonial> {
    if (data.order === undefined || data.order === 0) {
      const highestOrder = await Testimonial.findOne().sort({ order: -1 }).select('order');
      data.order = highestOrder ? (highestOrder.order || 0) + 1 : 1;
    }
    return await Testimonial.create(data);
  }

  async getAllTestimonials(): Promise<ITestimonial[]> {
    return await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  }

  async getTestimonialById(id: string): Promise<ITestimonial | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Testimonial.findById(id);
  }

  async updateTestimonial(id: string, data: Partial<ITestimonial>): Promise<ITestimonial | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async deleteTestimonial(id: string): Promise<ITestimonial | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Testimonial.findByIdAndDelete(id);
  }

  async toggleStatus(id: string): Promise<ITestimonial | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return null;
    testimonial.isActive = !testimonial.isActive;
    return await testimonial.save();
  }

  async reorderTestimonials(items: { id: string; order: number }[]): Promise<void> {
    const bulkOps = items
      .filter(item => mongoose.Types.ObjectId.isValid(item.id))
      .map(item => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item.id) },
          update: { $set: { order: item.order } },
        },
      }));

    if (bulkOps.length > 0) {
      await Testimonial.bulkWrite(bulkOps);
    }
  }

  async getAllTestimonialsAdmin(options: GetTestimonialsAdminOptions = {}): Promise<{ testimonials: ITestimonial[]; pagination: PaginationInfo }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = PaginationUtils.getSkip(page, limit);

    const filter: Record<string, any> = {};

    if (options.isActive !== undefined) {
      filter.isActive = options.isActive;
    }

    if (options.rating) {
      filter.rating = Number(options.rating);
    }

    if (options.search && options.search.trim()) {
      const searchRegex = new RegExp(options.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { role: searchRegex },
        { company: searchRegex },
        { content: searchRegex },
      ];
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(filter),
    ]);

    const pagination = PaginationUtils.calculatePagination(page, limit, total);
    return { testimonials, pagination };
  }

  async getTestimonialStats(): Promise<TestimonialStats> {
    const [total, active, avgResult] = await Promise.all([
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ isActive: true }),
      Testimonial.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]),
    ]);

    const averageRating = avgResult.length > 0 && avgResult[0].avgRating ? Math.round(avgResult[0].avgRating * 10) / 10 : 5;

    return {
      total,
      active,
      inactive: total - active,
      averageRating,
    };
  }
}
