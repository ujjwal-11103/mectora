// src/app/api/jobs/[jobId]/route.js
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
    try {
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { success: false, error: 'Job ID is required' },
                { status: 400 }
            );
        }

        const doc = await adminFirestore.collection('job_postings').doc(jobId).get();

        if (!doc.exists) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        const data = doc.data();
        const job = {
            id: doc.id,
            title: data.title,
            company: data.company,
            location: data.location,
            employmentType: data.employmentType,
            workMode: data.workMode,
            jdRawText: data.jdRawText,
            jdPdfUrl: data.jdPdfUrl,
            jdSummary: data.jdSummary,
            skills: data.skills,
            postedAt: data.postedAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString(),
            metrics: data.metrics,
            isActive: data.isActive, // ← Add this
        };

        return NextResponse.json({ success: true, job });
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}