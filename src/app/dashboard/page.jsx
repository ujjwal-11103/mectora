// src/app/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Show nothing while checking authentication
    if (!user) {
        return null;
    }

    console.log("User :", user);

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
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h3 className="font-semibold">User Info:</h3>
                        <pre className="text-sm mt-2">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}