"use client"
import Link from "next/link"

export default function JobCard({ job }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 cursor-pointer border border-white/20 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {job.title}
                        </h3>
                        <p className="text-lg font-semibold text-slate-700 mb-1">{job.company}</p>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <span className="text-sm">{job.location}</span>
                        </div>
                    </div>
                    <div className="text-right ml-4">
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                            {job.employmentType?.replace("_", " ") || "Full-time"}
                        </span>
                        <p className="text-xs text-slate-500 mt-2 font-medium">{job.workMode}</p>
                    </div>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                    {job.jdSummary ||
                        "Exciting opportunity to grow your career with innovative projects and collaborative team environment."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200/50"
                        >
                            {skill}
                        </span>
                    ))}
                    {job.skills?.length > 3 && (
                        <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200/50">
                            +{job.skills.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {formatDate(job.postedAt)}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {job.metrics?.applyClicks || 0} applies
                        </span>
                    </div>
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${job.isActive
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50"
                            : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200/50"
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                        {job.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>
        </Link>
    )
}
