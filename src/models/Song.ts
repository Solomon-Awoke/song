import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  lyricsEn?: string;
  category: mongoose.Types.ObjectId;
  slug: string;
  tags: string[];
  author?: string;
  biblicalRefs: string[];
  createdBy?: mongoose.Types.ObjectId;
  isApproved: boolean;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    titleAm: { type: String, required: true },
    titleEn: { type: String },
    lyricsAm: { type: String, required: true },
    lyricsEn: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    slug: { type: String, unique: true, required: true },
    tags: { type: [String], default: [] },
    author: { type: String },
    biblicalRefs: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isApproved: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SongSchema.pre('save', function () {
  if (!this.slug || this.isModified('titleAm')) {
    const generated = this.titleAm
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .trim();

    this.slug = generated || `song-${Date.now()}`;
  }
});

export default mongoose.models.Song ?? mongoose.model<ISong>('Song', SongSchema);
