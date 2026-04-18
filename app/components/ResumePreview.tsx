'use client';

import type { ResumeData } from '@/lib/types';

type Props = {
  resume: ResumeData;
};

export function ResumePreview({ resume }: Props) {
  const { personalInfo, skills, experience, education } = resume;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join(' • ') || 'Email • Phone • Location'}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {[personalInfo.website, personalInfo.linkedin].filter(Boolean).join(' • ')}
        </p>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Professional Summary</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {personalInfo.summary || 'Your AI-generated professional summary will appear here.'}
        </p>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Experience</h3>
        <div className="mt-3 space-y-5">
          {experience.map((item, index) => (
            <div key={`${item.company}-${index}`}>
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <p className="font-semibold text-slate-900">{item.title || 'Job Title'}</p>
                  <p className="text-sm text-slate-600">{item.company || 'Company'}{item.location ? ` • ${item.location}` : ''}</p>
                </div>
                <p className="text-sm text-slate-500">{[item.startDate, item.endDate].filter(Boolean).join(' - ') || 'Dates'}</p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {item.bullets.filter(Boolean).length > 0 ? (
                  item.bullets.filter(Boolean).map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)
                ) : (
                  <li>Your accomplishment-focused bullet points will show up here.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Education</h3>
        <div className="mt-3 space-y-3">
          {education.map((item, index) => (
            <div key={`${item.school}-${index}`} className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <p className="font-semibold text-slate-900">{item.school || 'School Name'}</p>
                <p className="text-sm text-slate-600">{[item.degree, item.field].filter(Boolean).join(', ') || 'Degree, Field of study'}</p>
              </div>
              <p className="text-sm text-slate-500">{[item.startDate, item.endDate].filter(Boolean).join(' - ') || 'Dates'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.filter(Boolean).length > 0 ? (
            skills.filter(Boolean).map((skill, index) => (
              <span key={`${skill}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-600">Add your core skills to preview them here.</span>
          )}
        </div>
      </section>
    </div>
  );
}
