import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrimeResume',
  description: 'AI-powered resume builder with Gemini + MongoDB + Next.js'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
