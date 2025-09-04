// src/app/api/user/route.js
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const userRecord = await adminAuth.getUser(uid);

        return NextResponse.json({
            uid: userRecord.uid,
            email: userRecord.email,
            emailVerified: userRecord.emailVerified,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            providerData: userRecord.providerData,
            createdAt: userRecord.metadata.creationTime,
            lastLoginAt: userRecord.metadata.lastSignInTime,
            // Add any other fields you need
        });
    } catch (error) {
        console.error('Admin SDK Error:', error);

        if (error.code === 'auth/user-not-found') {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}