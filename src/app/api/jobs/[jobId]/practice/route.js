// src/app/api/jobs/[jobId]/practice/route.js
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

    // Increment practiceClicks metric
    const jobRef = adminFirestore.collection('job_postings').doc(jobId);
    await jobRef.update({
      'metrics.practiceClicks': FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      message: 'Practice click recorded successfully'
    });
  } catch (error) {
    console.error('Error recording practice click:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record practice click' },
      { status: 500 }
    );
  }
}