import mongoose, { Document, Schema } from 'mongoose';

export interface IFaq extends Document {
    question: string;
    answer: string;
    category?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const faqSchema = new Schema<IFaq>({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        default: 'General',
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

faqSchema.index({ order: 1, createdAt: -1 });

export const Faq = mongoose.model<IFaq>('Faq', faqSchema);
