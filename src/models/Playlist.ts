import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Playlist ??
  mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
