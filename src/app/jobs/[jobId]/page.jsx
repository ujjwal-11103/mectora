//src/app/jobs/[jobId]/page.jsx
"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [practiceLoading, setPracticeLoading] = useState(false)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/jobs/${params.jobId}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch job details")
                }

                const data = await response.json()
                if (data.success) {
                    setJob(data.job)
                } else {
                    throw new Error(data.error || "Failed to fetch job details")
                }


            } catch (err) {
                setError(err.message)
                // Mock data for development
                setJob({
                    id: params.jobId,
                    title: "Senior Frontend Developer",
                    company: "TechCorp Inc.",
                    location: "San Francisco, CA",
                    employmentType: "FULL_TIME",
                    workMode: "Remote",
                    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
                    jdSummary:
                        "We are looking for a senior frontend developer to join our team and build amazing user experiences.",
                    jdRawText:
                        "We are seeking a talented Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features, optimizing applications for maximum speed and scalability, and collaborating with backend developers and designers.",
                    jdPdfUrl: "/sample-job-description.pdf",
                    practiceUrl: "https://example.com/practice",
                    isActive: true,
                    postedAt: new Date().toISOString(),
                    metrics: { applyClicks: 45, practiceClicks: 23 },
                })
            } finally {
                setLoading(false)
            }
        }

        if (params.jobId) {
            fetchJob()
        }
    }, [params.jobId])

    useEffect(() => {

        console.log("Job details", job);

    }, [job])

    const handleShare = async () => {
        try {
            const jobUrl = `${window.location.origin}/jobs/${params.jobId}`
            await navigator.clipboard.writeText(jobUrl)
            setCopied(true)
            toast.success("Job link copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
            toast.error("Failed to copy link")
        }
    }

    const handleApply = async () => {
        try {
            const response = await fetch(`/api/jobs/${params.jobId}/apply`, {
                method: "POST",
            })

            if (response.ok) {
                toast.success("You have successfully applied!")
            } else {
                toast.error("Failed to apply. Please try again.")
            }
        } catch (err) {
            console.error("Failed to apply:", err)
            toast.error("Something went wrong!")
        }
    }

    const handlePractice = async () => {
        if (!job?.practiceUrl) return

        setPracticeLoading(true)
        try {
            // First, record the practice click
            const response = await fetch(`/api/jobs/${params.jobId}/practice`, {
                method: "POST",
            })

            if (response.ok) {
                // Then open the practice URL in a new tab
                window.open(job.practiceUrl, "_blank", "noopener,noreferrer")
                toast.success("Practice session started!")

                // Refresh job data to update metrics
                const jobResponse = await fetch(`/api/jobs/${params.jobId}`)
                if (jobResponse.ok) {
                    const jobData = await jobResponse.json()
                    if (jobData.success) {
                        setJob(jobData.job)
                    }
                }
            } else {
                toast.error("Failed to start practice session")
            }
        } catch (err) {
            console.error("Failed to practice:", err)
            toast.error("Something went wrong!")
        } finally {
            setPracticeLoading(false)
        }
    }

    const toggleJobStatus = async () => {
        if (!user?.isAdmin) return

        setUpdatingStatus(true)
        try {
            const response = await fetch(`/api/jobs/${params.jobId}/toggle-active`, {
                method: "POST",
            })

            const data = await response.json()

            if (data.success) {
                setJob((prev) => ({ ...prev, isActive: data.isActive }))
                toast.success(data.message)
            } else {
                toast.error(data.error || "Failed to update job status")
            }
        } catch (err) {
            console.error("Failed to toggle job status:", err)
            toast.error("Something went wrong!")
        } finally {
            setUpdatingStatus(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                            <div
                                className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin mx-auto"
                                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                            ></div>
                        </div>
                        <p className="text-slate-600 text-lg font-medium">Loading job details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
                <div className="max-w-4xl mx-auto px-4">
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
                        <h2 className="text-xl font-bold mb-2 text-center">Job Not Found</h2>
                        <p className="text-center mb-6">{error || "The job you are looking for does not exist."}</p>
                        <Link
                            href="/all-jobs"
                            className="block text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                        >
                            ← Back to all jobs
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link
                    href="/all-jobs"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to all jobs
                </Link>

                {/* Admin Status Badge and Toggle */}
                {user?.isAdmin && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-amber-800 text-lg mb-2">Admin Controls</h3>
                                <p className="text-amber-700">
                                    Current status:
                                    <span className={`ml-2 font-bold ${job.isActive ? "text-green-600" : "text-red-600"}`}>
                                        {job.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                {job.practiceUrl && <p className="text-amber-700 text-sm mt-1">Practice URL: {job.practiceUrl}</p>}
                            </div>
                            <button
                                onClick={toggleJobStatus}
                                disabled={updatingStatus}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${job.isActive
                                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                                    } disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                            >
                                {updatingStatus ? "Updating..." : job.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${job.isActive
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full mr-2 ${job.isActive ? "bg-white" : "bg-white"}`}></div>
                        {job.isActive ? "Active Position" : "Position Closed"}
                    </span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                                {job.title}
                            </h1>
                            <p className="text-2xl font-semibold text-slate-700 mb-2">{job.company}</p>
                            <div className="flex items-center gap-2 text-slate-600 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="text-lg">{job.location}</span>
                            </div>
                        </div>
                        <div className="text-right ml-6">
                            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-3 shadow-lg">
                                {job.employmentType?.replace("_", " ") || "Full-time"}
                            </span>
                            <p className="text-slate-600 font-medium">{job.workMode}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {job.skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-300/50 shadow-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="prose max-w-none mb-8">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">About This Role</h3>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {job.jdRawText || job.jdSummary || "No detailed description available."}
                            </p>
                        </div>
                    </div>

                    {job.jdPdfUrl && (
                        <div className="mb-8">
                            <a
                                href={job.jdPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                View Complete Job Description (PDF)
                            </a>
                        </div>
                    )}

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            {copied ? "Copied!" : "Share Job"}
                        </button>

                        <button
                            onClick={handleApply}
                            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"
                                />
                            </svg>
                            Apply Now
                        </button>

                        {job.practiceUrl && (
                            <button
                                onClick={handlePractice}
                                disabled={practiceLoading}
                                className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {practiceLoading ? "Starting..." : "Practice Interview"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Job Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{job.metrics?.applyClicks || 0}</p>
                            <p className="text-slate-600 font-medium">Total Applications</p>
                        </div>
                        <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 mb-1">{job.metrics?.practiceClicks || 0}</p>
                            <p className="text-slate-600 font-medium">Practice Sessions</p>
                        </div>
                        {job.practiceUrl && (
                            <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-emerald-600 mb-1">
                                    {Math.round(
                                        ((job.metrics?.practiceClicks || 0) /
                                            ((job.metrics?.applyClicks || 0) + (job.metrics?.practiceClicks || 0) || 1)) *
                                        100,
                                    )}
                                    %
                                </p>
                                <p className="text-slate-600 font-medium">Practice Rate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
