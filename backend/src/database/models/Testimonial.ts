import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    role: string;
    company?: string;
    content: string;
    image?: string;
    rating: number;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
        default: '',
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        default: '',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5,
    },
    order: {
        type: Number,
        default: 0,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
});

testimonialSchema.index({ order: 1, createdAt: -1 });

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
