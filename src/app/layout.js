// src/app/layout.js
import { AuthContextProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Firebase Auth App',
  description: 'Authentication with Firebase and Next.js',
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