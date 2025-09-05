// src/app/api/jobs/route.js (Temporary fix)
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';

export async function GET() {
    try {
        // Temporary: Fetch all jobs and filter/sort manually
        const jobsSnapshot = await adminFirestore
            .collection('job_postings')
            .get();

        const jobs = [];
        jobsSnapshot.forEach(doc => {
            const data = doc.data();

            // Only include active jobs
            if (data.isActive !== false) { // Default to true if undefined
                jobs.push({
                    id: doc.id,
                    title: data.title,
                    company: data.company,
                    location: data.location,
                    employmentType: data.employmentType,
                    workMode: data.workMode,
                    jdSummary: data.jdSummary,
                    skills: data.skills,
                    postedAt: data.postedAt?.toDate().toISOString(),
                    metrics: data.metrics,
                    isActive: data.isActive // For sorting
                });
            }
        });

        // Manual sorting - most recent first
        jobs.sort((a, b) => {
            const dateA = new Date(a.postedAt || 0);
            const dateB = new Date(b.postedAt || 0);
            return dateB - dateA;
        });

        return NextResponse.json({ success: true, jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}