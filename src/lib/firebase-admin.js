// src/lib/firebase-admin.js
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Method 1: Using environment variables (Recommended for deployment)
const adminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

// Initialize only if it hasn't been initialized already
// This prevents multiple initializations during hot-reload
if (!getApps().length) {
    initializeApp(adminConfig);
}

// Export the initialized services
export const adminAuth = getAuth();
export const adminFirestore = getFirestore();