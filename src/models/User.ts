import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  role: 'viewer' | 'contributor' | 'editor' | 'admin';
  favorites: mongoose.Types.ObjectId[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    image: { type: String },
    role: {
      type: String,
      enum: ['viewer', 'contributor', 'editor', 'admin'],
      default: 'viewer',
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    password: { type: String },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User ??
  mongoose.model<IUser>('User', UserSchema);
