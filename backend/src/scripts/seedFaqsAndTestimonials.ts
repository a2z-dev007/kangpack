import mongoose from 'mongoose';
import { database, Faq, Testimonial } from '../database';
import { env } from '../config/env';

export const initialFaqs = [
  {
    question: "What makes Kangpack different from regular backpacks?",
    answer: "Kangpack is specifically designed as a wearable mobile workstation that lets you work hands-free anywhere, combining ergonomic balance, laptop protection, and instant access.",
    category: "Design & Features",
    order: 1,
    isActive: true,
  },
  {
    question: "Can I use Kangpack while walking or standing?",
    answer: "Yes! The harness and support structure keep your laptop stable and secure while standing or moving.",
    category: "Usability",
    order: 2,
    isActive: true,
  },
  {
    question: "What laptops fit inside Kangpack?",
    answer: "Kangpack comfortably accommodates laptops up to 16 inches, including MacBook Pro 16\", Dell XPS 15/16, and ThinkPad models.",
    category: "Compatibility",
    order: 3,
    isActive: true,
  },
  {
    question: "How does the weight distribution work?",
    answer: "Our dual-point ergonomic harness distributes weight evenly across your shoulders, core, and hips, significantly reducing neck and back strain.",
    category: "Ergonomics",
    order: 4,
    isActive: true,
  },
  {
    question: "Is it water-resistant?",
    answer: "Yes, Kangpack features weather-treated full-grain leather and water-repellent ballistic fabrics with waterproof zippers.",
    category: "Materials & Durability",
    order: 5,
    isActive: true,
  },
  {
    question: "Does it protect my laptop?",
    answer: "Yes, it features multi-layer shock-absorbing EVA foam padding and radiation shield technology.",
    category: "Protection & Safety",
    order: 6,
    isActive: true,
  },
  {
    question: "Is it suitable for travel and public spaces?",
    answer: "Perfectly! It's TSA-compliant, compact, and ideal for trains, airports, cafes, and outdoor workspaces.",
    category: "Travel",
    order: 7,
    isActive: true,
  },
];

export const initialTestimonials = [
  {
    name: "Eddie Brock",
    role: "CEO",
    company: "Royal Kingscope",
    content: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=12",
    order: 1,
    isActive: true,
  },
  {
    name: "Sarah Mitchell",
    role: "Designer",
    company: "Creative Studios",
    content: "The perfect companion for my daily commute. It's stylish, functional, and incredibly comfortable to wear all day long.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=45",
    order: 2,
    isActive: true,
  },
  {
    name: "James Chen",
    role: "Developer",
    company: "Tech Innovations",
    content: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=33",
    order: 3,
    isActive: true,
  },
  {
    name: "Maria Garcia",
    role: "Marketing Director",
    company: "Brand Solutions",
    content: "This bag has transformed how I work on the go. The organization is perfect and the quality is outstanding!",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=47",
    order: 4,
    isActive: true,
  },
  {
    name: "David Kim",
    role: "Entrepreneur",
    company: "StartUp Ventures",
    content: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=68",
    order: 5,
    isActive: true,
  },
  {
    name: "Emily Watson",
    role: "Consultant",
    company: "Global Advisors",
    content: "The best investment I've made for my daily routine. Comfortable, practical, and looks professional in any setting.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=26",
    order: 6,
    isActive: true,
  },
];

export async function seedFaqsAndTestimonials() {
  console.log('--- Seeding FAQs & Testimonials ---');

  // 1. Seed FAQs (Idempotent update/insert based on question)
  console.log(`Processing ${initialFaqs.length} FAQs...`);
  for (const faq of initialFaqs) {
    await Faq.findOneAndUpdate(
      { question: faq.question },
      { $set: faq },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const totalFaqs = await Faq.countDocuments();
  console.log(`✓ FAQs seeded successfully. Total in database: ${totalFaqs}`);

  // 2. Seed Testimonials (Idempotent update/insert based on name and company)
  console.log(`Processing ${initialTestimonials.length} Testimonials...`);
  for (const t of initialTestimonials) {
    await Testimonial.findOneAndUpdate(
      { name: t.name, company: t.company },
      { $set: t },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const totalTestimonials = await Testimonial.countDocuments();
  console.log(`✓ Testimonials seeded successfully. Total in database: ${totalTestimonials}`);
}

async function runStandalone() {
  try {
    console.log(`Connecting to database: ${env.MONGODB_URI}`);
    await database.connect();
    await seedFaqsAndTestimonials();
    console.log('All FAQs and Testimonials seeded cleanly!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

if (require.main === module) {
  runStandalone();
}
