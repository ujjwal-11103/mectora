// src/app/api/job-postings/route.js
import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const jobData = await request.json();

    // Validate required fields
    if (!jobData.title || !jobData.applyUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and apply URL are required' },
        { status: 400 }
      );
    }

    const jobPosting = {
      title: jobData.title,
      company: jobData.company || null,
      location: jobData.location || null,
      employmentType: jobData.employmentType || null,
      workMode: jobData.workMode || null,
      jdRawText: jobData.jdRawText || '',
      jdPdfUrl: jobData.jdPdfUrl || null,
      jdSummary: jobData.jdSummary || null,
      skills: jobData.skills || [],
      applyUrl: jobData.applyUrl,
      practiceUrl: '', // Will be updated later from backend
      isActive: true,
      postedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metrics: {
        applyClicks: 0,
        practiceClicks: 0
      }
    };

    // Add to Firestore
    const docRef = await adminFirestore.collection('job_postings').add(jobPosting);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Job posting created successfully'
    });

  } catch (error) {
    console.error('Error creating job posting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job posting' },
      { status: 500 }
    );
  }
}