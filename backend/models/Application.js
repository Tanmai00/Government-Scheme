import { Schema, model } from 'mongoose';

const ApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    schemeId: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    application_data: { type: Schema.Types.Mixed, required: true }, // Stores the form fields
    applied_at: { type: Date, default: Date.now },
    reviewed_at: { type: Date },
    admin_notes: { type: String },
  },
  { timestamps: true }
);

// Ensures a user can only apply to a scheme once
ApplicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const Application = model('Application', ApplicationSchema);