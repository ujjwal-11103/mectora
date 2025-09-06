// src/app/api/jobs/[jobId]/toggle-active/route.js
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request, { params }) {
    try {
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { success: false, error: 'Job ID is required' },
                { status: 400 }
            );
        }

        // Get the current job to toggle the status
        const jobDoc = await adminFirestore.collection('job_postings').doc(jobId).get();

        if (!jobDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        const currentStatus = jobDoc.data().isActive;
        const newStatus = !currentStatus;

        // Update the job status
        await adminFirestore.collection('job_postings').doc(jobId).update({
            isActive: newStatus,
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: `Job ${newStatus ? 'activated' : 'deactivated'} successfully`,
            isActive: newStatus
        });

    } catch (error) {
        console.error('Error toggling job status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update job status' },
            { status: 500 }
        );
    }
}