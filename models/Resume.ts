import { Schema, model, models } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    company: { type: String, default: '' },
    title: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    bullets: { type: [String], default: [] }
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    school: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' }
  },
  { _id: false }
);

const ResumeSchema = new Schema(
  {
    personalInfo: {
      fullName: { type: String, required: true, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    skills: { type: [String], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] }
  },
  {
    timestamps: true
  }
);

export const Resume = models.Resume || model('Resume', ResumeSchema);
