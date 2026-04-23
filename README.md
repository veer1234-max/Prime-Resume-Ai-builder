# PrimeResume
For the live app, follow this link - https://prime-resume-ai-builder.onrender.com/

PrimeResume is a full-stack AI-powered resume builder built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **Google Gemini**.

It lets users:
- enter personal information, work history, education, and skills
- generate a polished professional summary with Gemini
- improve achievement bullet points with Gemini
- save and reload resume versions from MongoDB
- deploy the full app easily on Railway

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini via `@google/genai`
- **Deployment:** Railway

## Features

### Resume Builder UI
- clean modern single-page interface
- editable sections for personal info, summary, work experience, education, and skills
- live resume preview

### AI Writing Assistance
- **Generate Summary:** creates a professional summary based on profile information
- **Improve Bullets:** rewrites work experience bullets to sound more polished and ATS-friendly

### Data Persistence
- save resume data to MongoDB
- load recent resumes
- update and delete saved resumes

## Project Structure

```bash
PrimeResume/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── bullets/route.ts
│   │   │   └── summary/route.ts
│   │   ├── resumes/route.ts
│   │   └── resumes/[id]/route.ts
│   ├── components/
│   │   ├── ResumeBuilder.tsx
│   │   └── ResumePreview.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts
│   ├── gemini.ts
│   └── types.ts
├── models/
│   └── Resume.ts
├── .env.example
├── package.json
├── railway.json
└── README.md
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Create a file named `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/primeresume
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If you are using Railway's MongoDB service, you can also rely on `MONGO_URL` instead of `MONGODB_URI`.

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`

## Gemini API Key

Get your Gemini API key from Google AI Studio, then add it to:

```env
GEMINI_API_KEY=your_key_here
```

## MongoDB Options

You can use either:
- local MongoDB
- MongoDB Atlas
- Railway MongoDB

The app will accept:
- `MONGODB_URI`
- `MONGO_URL`
- or Railway-style `MONGOHOST`, `MONGOPORT`, `MONGOUSER`, `MONGOPASSWORD`

## Railway Deployment

### 1. Push this project to GitHub

### 2. Create a new Railway project
- choose **Deploy from GitHub repo**
- select your PrimeResume repository

### 3. Add environment variables
In Railway, add:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=https://your-domain.up.railway.app
```

### 4. Add MongoDB
You can:
- add Railway MongoDB and reference its `MONGO_URL`
- or paste a MongoDB Atlas connection string into `MONGODB_URI`

### 5. Deploy
Railway should detect the app automatically and build it with Nixpacks.

## API Endpoints

### Resume CRUD
- `GET /api/resumes` — fetch all resumes
- `POST /api/resumes` — create a new resume
- `GET /api/resumes/:id` — fetch one resume
- `PUT /api/resumes/:id` — update a resume
- `DELETE /api/resumes/:id` — delete a resume

### AI Endpoints
- `POST /api/ai/summary` — generate a professional summary
- `POST /api/ai/bullets` — improve job bullets

## Future Improvements

- user authentication
- downloadable PDF export
- multiple resume templates
- ATS score suggestions
- job-specific tailoring
- cover letter generator

## Notes

This starter is designed to be easy to extend. A good next step would be adding authentication and PDF export so users can manage multiple resumes securely and download finished versions.
