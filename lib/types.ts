export type ExperienceItem = {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

export type ResumeData = {
  _id?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  createdAt?: string;
  updatedAt?: string;
};

export const emptyResume: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: ''
  },
  skills: [''],
  experience: [
    {
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      bullets: ['']
    }
  ],
  education: [
    {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }
  ]
};
