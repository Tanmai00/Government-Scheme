import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true, required: true },
    username: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    // district_id has been removed
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);