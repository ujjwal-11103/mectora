// src/components/get-hired/JobPostingSuccess.jsx
'use client';
import { useRouter } from 'next/navigation';

export default function JobPostingSuccess() {
    const router = useRouter();

    return (
        <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
            <p className="text-gray-600 mb-6">The job posting has been created and is now live.</p>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => router.push('/get-hired')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                >
                    Post Another Job
                </button>
                <button
                    onClick={() => router.push('/home')}
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}