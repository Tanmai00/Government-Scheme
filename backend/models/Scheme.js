import { Schema, model } from 'mongoose';

const EligibilityCriterionSchema = new Schema(
  {
    question: { type: String, required: true },
  },
  { _id: false }
);

const SchemeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    benefits: { type: String, required: true },
    required_documents: [{ type: String }],
    important_notes: { type: String },
    application_fields: [{ type: String }], // e.g., ['aadharNumber', 'bankAccount']
    eligibility_criteria: [EligibilityCriterionSchema],
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Scheme = model('Scheme', SchemeSchema);