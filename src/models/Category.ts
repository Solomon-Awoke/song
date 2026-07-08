import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  nameAm: string;
  nameEn?: string;
  slug: string;
  order: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    nameAm: { type: String, required: true },
    nameEn: { type: String },
    slug: { type: String, unique: true, required: true },
    order: { type: Number, default: 0 },
    icon: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Category ??
  mongoose.model<ICategory>('Category', CategorySchema);
