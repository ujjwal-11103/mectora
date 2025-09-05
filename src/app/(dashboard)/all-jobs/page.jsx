// src/app/all-jobs/page.jsx
'use client';
import { useJobs } from '@/hooks/useJobs';
import JobCard from '@/components/jobs/JobCard';

export default function AllJobsPage() {
    const { jobs, loading, error, refetch } = useJobs();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading jobs...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                            <p className="font-semibold">Error loading jobs</p>
                            <p>{error}</p>
                            <button
                                onClick={refetch}
                                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Job Opportunities</h1>
                    <p className="text-gray-600">
                        Discover your next career move from our curated list of opportunities
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-lg">No jobs available at the moment</p>
                                <p className="text-sm">Check back later for new opportunities</p>
                            </div>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}