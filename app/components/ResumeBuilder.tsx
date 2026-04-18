'use client';

import { useEffect, useMemo, useState } from 'react';
import { emptyResume, type EducationItem, type ExperienceItem, type ResumeData } from '@/lib/types';
import { ResumePreview } from './ResumePreview';

type ApiResume = ResumeData & { _id: string };

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [savedResumes, setSavedResumes] = useState<ApiResume[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingBullets, setLoadingBullets] = useState<number | null>(null);
  const [saveState, setSaveState] = useState('');

  const targetRole = useMemo(() => resume.experience[0]?.title || '', [resume.experience]);

  useEffect(() => {
    void loadResumes();
  }, []);

  async function loadResumes() {
    const response = await fetch('/api/resumes');
    const data = await response.json();
    setSavedResumes(data);
  }

  function updatePersonalInfo(field: keyof ResumeData['personalInfo'], value: string) {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  }

  function updateExperience(index: number, field: keyof ExperienceItem, value: string | string[]) {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  }

  function updateEducation(index: number, field: keyof EducationItem, value: string) {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  }

  function updateSkill(index: number, value: string) {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill))
    }));
  }

  function updateBullet(experienceIndex: number, bulletIndex: number, value: string) {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item, idx) =>
        idx === experienceIndex
          ? {
              ...item,
              bullets: item.bullets.map((bullet, bIdx) => (bIdx === bulletIndex ? value : bullet))
            }
          : item
      )
    }));
  }

  function addExperience() {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', title: '', location: '', startDate: '', endDate: '', bullets: [''] }
      ]
    }));
  }

  function addEducation() {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', startDate: '', endDate: '' }]
    }));
  }

  function addSkill() {
    setResume((prev) => ({ ...prev, skills: [...prev.skills, ''] }));
  }

  function addBullet(experienceIndex: number) {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item, idx) =>
        idx === experienceIndex ? { ...item, bullets: [...item.bullets, ''] } : item
      )
    }));
  }

  async function generateSummary() {
    try {
      setLoadingSummary(true);
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: resume.personalInfo.fullName,
          targetRole,
          yearsOfExperience: resume.experience.filter((item) => item.company || item.title).length,
          skills: resume.skills.filter(Boolean),
          highlights: resume.experience.flatMap((item) => item.bullets.filter(Boolean)).join(' | '),
          education: resume.education.map((item) => `${item.degree} in ${item.field} at ${item.school}`).join(' | ')
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Summary generation failed');
      updatePersonalInfo('summary', data.text || '');
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : 'Could not generate summary');
    } finally {
      setLoadingSummary(false);
    }
  }

  async function improveBullets(index: number) {
    try {
      setLoadingBullets(index);
      const item = resume.experience[index];
      const response = await fetch('/api/ai/bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          company: item.company,
          bullets: item.bullets.filter(Boolean)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Bullet enhancement failed');
      updateExperience(index, 'bullets', data.bullets || item.bullets);
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : 'Could not improve bullets');
    } finally {
      setLoadingBullets(null);
    }
  }

  async function saveResume() {
    try {
      setSaveState('Saving...');
      const endpoint = activeResumeId ? `/api/resumes/${activeResumeId}` : '/api/resumes';
      const method = activeResumeId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save resume');

      setActiveResumeId(data._id);
      setSaveState('Saved successfully.');
      await loadResumes();
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : 'Could not save resume');
    }
  }

  async function loadResume(id: string) {
    const response = await fetch(`/api/resumes/${id}`);
    const data = await response.json();
    setResume({
      ...data,
      skills: data.skills?.length ? data.skills : [''],
      experience: data.experience?.length ? data.experience : emptyResume.experience,
      education: data.education?.length ? data.education : emptyResume.education
    });
    setActiveResumeId(id);
    setSaveState(`Loaded ${data.personalInfo?.fullName || 'resume'}.`);
  }

  async function createNewResume() {
    setResume(emptyResume);
    setActiveResumeId(null);
    setSaveState('Started a new resume.');
  }

  async function deleteResume(id: string) {
    const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
    if (response.ok) {
      if (activeResumeId === id) {
        await createNewResume();
      }
      await loadResumes();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-slate-950 px-8 py-10 text-white shadow-soft lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">PrimeResume</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Build a professional resume with AI support.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Fill in your details, let Gemini sharpen your summary and achievements, then save everything to MongoDB through built-in Next.js API routes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={createNewResume} className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium hover:bg-white/10">
              New Resume
            </button>
            <button onClick={saveResume} className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600">
              Save Resume
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">{saveState || 'Ready to build your next resume.'}</p>
          <div className="flex flex-wrap gap-2">
            {savedResumes.slice(0, 4).map((item) => (
              <div key={item._id} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <button className="text-sm font-medium text-slate-700" onClick={() => loadResume(item._id)}>
                  {item.personalInfo?.fullName || 'Untitled'}
                </button>
                <button className="text-xs text-rose-600" onClick={() => deleteResume(item._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-[28px] bg-white p-6 shadow-soft">
            <section>
              <SectionTitle title="Personal information" subtitle="Start with the essentials recruiters expect to see." />
              <div className="grid gap-4 md:grid-cols-2">
                <input placeholder="Full name" value={resume.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                <input placeholder="Email" value={resume.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                <input placeholder="Phone" value={resume.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                <input placeholder="Location" value={resume.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                <input placeholder="Portfolio / website" value={resume.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
                <input placeholder="LinkedIn URL" value={resume.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-700">Professional summary</label>
                  <button
                    onClick={generateSummary}
                    disabled={loadingSummary}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loadingSummary ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  placeholder="Write a quick summary or let Gemini draft one for you."
                  value={resume.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Work experience" subtitle="Show impact, ownership, and measurable outcomes." />
              <div className="space-y-6">
                {resume.experience.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input placeholder="Job title" value={item.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} />
                      <input placeholder="Company" value={item.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                      <input placeholder="Location" value={item.location} onChange={(e) => updateExperience(index, 'location', e.target.value)} />
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Start date" value={item.startDate} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} />
                        <input placeholder="End date" value={item.endDate} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <textarea
                          key={bulletIndex}
                          placeholder={`Achievement bullet ${bulletIndex + 1}`}
                          value={bullet}
                          onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={() => addBullet(index)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Add bullet
                      </button>
                      <button
                        onClick={() => improveBullets(index)}
                        disabled={loadingBullets === index}
                        className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                      >
                        {loadingBullets === index ? 'Improving...' : 'Improve bullets with AI'}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Add experience section
                </button>
              </div>
            </section>

            <section>
              <SectionTitle title="Education" subtitle="Add degrees, schools, and study periods." />
              <div className="space-y-4">
                {resume.education.map((item, index) => (
                  <div key={index} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-2">
                    <input placeholder="School" value={item.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                    <input placeholder="Degree" value={item.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                    <input placeholder="Field of study" value={item.field} onChange={(e) => updateEducation(index, 'field', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Start date" value={item.startDate} onChange={(e) => updateEducation(index, 'startDate', e.target.value)} />
                      <input placeholder="End date" value={item.endDate} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Add education section
                </button>
              </div>
            </section>

            <section>
              <SectionTitle title="Skills" subtitle="Add technical, tools, and soft skills relevant to the role." />
              <div className="space-y-3">
                {resume.skills.map((skill, index) => (
                  <input key={index} placeholder={`Skill ${index + 1}`} value={skill} onChange={(e) => updateSkill(index, e.target.value)} />
                ))}
                <button onClick={addSkill} className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Add skill
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-soft">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Your resume updates instantly as you type. Save versions to MongoDB and reload them from the shortcuts above.
              </p>
            </div>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </main>
  );
}
