// src/app/jobs/[jobId]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext'; // ← Import useAuth

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth(); // ← Get current user
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/jobs/${params.jobId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }

                const data = await response.json();
                if (data.success) {
                    setJob(data.job);
                } else {
                    throw new Error(data.error || 'Failed to fetch job details');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.jobId) {
            fetchJob();
        }
    }, [params.jobId]);

    const handleShare = async () => {
        try {
            const jobUrl = `${window.location.origin}/jobs/${params.jobId}`;
            await navigator.clipboard.writeText(jobUrl);
            setCopied(true);
            toast.success('Job link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    const handleApply = async () => {
        try {
            const response = await fetch(`/api/jobs/${params.jobId}/apply`, {
                method: "POST",
            });

            if (response.ok) {
                toast.success("You have successfully applied!");
            } else {
                toast.error("Failed to apply. Please try again.");
            }
        } catch (err) {
            console.error("Failed to apply:", err);
            toast.error("Something went wrong!");
        }
    };

    const toggleJobStatus = async () => {
        if (!user?.isAdmin) return;

        setUpdatingStatus(true);
        try {
            const response = await fetch(`/api/jobs/${params.jobId}/toggle-active`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setJob(prev => ({ ...prev, isActive: data.isActive }));
                toast.success(data.message);
            } else {
                toast.error(data.error || 'Failed to update job status');
            }
        } catch (err) {
            console.error("Failed to toggle job status:", err);
            toast.error("Something went wrong!");
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-md">
                        <h2 className="text-lg font-semibold mb-2">Job Not Found</h2>
                        <p>{error || 'The job you are looking for does not exist.'}</p>
                        <Link href="/all-jobs" className="text-blue-600 hover:underline mt-4 inline-block">
                            ← Back to all jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/all-jobs" className="text-blue-600 hover:underline mb-6 inline-block">
                    ← Back to all jobs
                </Link>

                {/* Admin Status Badge and Toggle */}
                {user?.isAdmin && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-yellow-800">Admin Controls</h3>
                                <p className="text-yellow-700 text-sm">
                                    Current status:
                                    <span className={`ml-2 font-medium ${job.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {job.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={toggleJobStatus}
                                disabled={updatingStatus}
                                className={`px-4 py-2 rounded-md font-medium ${job.isActive
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    } disabled:opacity-50`}
                            >
                                {updatingStatus ? 'Updating...' : job.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Badge for All Users */}
                <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <p className="text-xl text-gray-700 mb-2">{job.company}</p>
                            <p className="text-gray-600 mb-4">{job.location}</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
                                {job.employmentType?.replace('_', ' ') || 'Full-time'}
                            </span>
                            <p className="text-sm text-gray-500">{job.workMode}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {job.skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {job.jdRawText || job.jdSummary || 'No detailed description available.'}
                        </p>
                    </div>

                    {job.jdPdfUrl && (
                        <div className="mb-6">
                            <a
                                href={job.jdPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Full Job Description PDF
                            </a>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {copied ? 'Copied!' : 'Share'}
                        </button>

                        <button
                            onClick={handleApply}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Apply Now
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Job Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{job.metrics?.applyClicks || 0}</p>
                            <p className="text-gray-600">Total Applies</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{job.metrics?.practiceClicks || 0}</p>
                            <p className="text-gray-600">Practice Sessions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}