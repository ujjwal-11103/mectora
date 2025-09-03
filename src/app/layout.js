// src/app/layout.js
import { AuthContextProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Mectora - AI-Powered Career Platform for Students',
  description: 'Mectora helps students excel in their career journey with AI-powered interview practice, ATS-friendly resume building, and personalized skill development tools. Prepare for your dream job with confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}