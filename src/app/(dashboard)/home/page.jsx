// src/app/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function page() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Show nothing while checking authentication
  if (!user) {
    return null;
  }

  // Use the extended profile hook
  const { userProfile, loading } = useUserProfile();

  if (loading)
    return <div className="flex min-h-screen items-center justify-center p-24">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Profile...</p>
      </div>
    </div>;

  console.log("User :", user);
  console.log("UserProfile :", userProfile);

  return (
    <div className="min-h-screen p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}!</h2>
          <p className="text-gray-600">You are successfully logged in.</p>

          <div>
            <p>Email verified: {userProfile?.emailVerified ? 'Yes' : 'No'}</p>
            <p>Account created: {userProfile?.createdAt}</p>
            <p>Last login: {userProfile?.lastLoginAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}