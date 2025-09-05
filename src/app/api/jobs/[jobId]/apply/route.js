// src/app/api/jobs/[jobId]/apply/route.js
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore'; // ← Correct import

export async function POST(request, { params }) {
    try {
        // Await the params for Next.js 13+
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { success: false, error: 'Job ID is required' },
                { status: 400 }
            );
        }

        // Use the imported FieldValue
        const jobRef = adminFirestore.collection('job_postings').doc(jobId);
        await jobRef.update({
            'metrics.applyClicks': FieldValue.increment(1), // ← Use imported FieldValue
            updatedAt: FieldValue.serverTimestamp() // ← Use imported FieldValue
        });

        // console.log('FieldValue available:', !!FieldValue);
        // console.log('FieldValue.increment available:', FieldValue?.increment ? 'Yes' : 'No');

        return NextResponse.json({
            success: true,
            message: 'Apply click recorded successfully'
        });

    } catch (error) {
        console.error('Error recording apply click:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to record apply click' },
            { status: 500 }
        );
    }
}