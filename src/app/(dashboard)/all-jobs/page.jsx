"use client"
import { useJobs } from "@/hooks/useJobs"
import JobCard from "@/components/jobs/JobCard"

export default function AllJobsPage() {
    const { jobs, loading, error, refetch } = useJobs()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                        <div
                            className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin mx-auto"
                            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                        ></div>
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Discovering amazing opportunities...</p>
                    <p className="text-slate-500 text-sm mt-2">Finding the perfect match for your career</p>
                </div>
            </div>
        )
    }


    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="bg-white/80 backdrop-blur-sm border border-red-200 text-red-700 p-8 rounded-2xl shadow-xl max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="font-bold text-lg mb-2">Oops! Something went wrong</p>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={refetch}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Discover Your Dream Job
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Explore curated opportunities from top companies and take the next step in your career journey
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">{jobs.length} opportunities available</span>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-slate-700 mb-2">No opportunities yet</p>
                                <p className="text-slate-500">
                                    New positions are added regularly. Check back soon for exciting opportunities!
                                </p>
                            </div>
                        </div>
                    ) : (
                        jobs.map((job) => <JobCard key={job.id} job={job} />)
                    )}
                </div>
            </div>
        </div>
    )
}
