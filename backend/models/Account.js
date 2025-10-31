import { Schema, model } from 'mongoose';

const AccountSchema = new Schema(
  {
    phone_number: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true }, // We'll create this from the phone number
    password_hash: { type: String, required: true },
    type: { type: String, enum: ['user', 'admin'], required: true },
  },
  { timestamps: true }
);

export const Account = model('Account', AccountSchema);