// src/components/jobs/JobCard.jsx
'use client';
import Link from 'next/link';

export default function JobCard({ job }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {job.title}
                        </h3>
                        <p className="text-lg text-gray-700 mb-1">{job.company}</p>
                        <p className="text-gray-600 mb-2">{job.location}</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {job.employmentType?.replace('_', ' ') || 'Full-time'}
                        </span>
                    </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                    {job.jdSummary || 'No description available'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 4).map((skill, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                            {skill}
                        </span>
                    ))}
                    {job.skills?.length > 4 && (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                            +{job.skills.length - 4} more
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Posted {formatDate(job.postedAt)}
                    </span>
                    <span className="text-sm text-gray-500">
                        {job.metrics?.applyClicks || 0} applies
                    </span>
                </div>
            </div>
        </Link>
    );
}