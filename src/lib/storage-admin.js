// src/lib/storage-admin.js
import { adminStorage } from '@/lib/firebase-admin';

/**
 * Upload a PDF file to Firebase Storage using Admin SDK
 * @param {Buffer} fileBuffer - The file content as Buffer
 * @param {string} fileName - The file name
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string>} Download URL of the uploaded file
 */
export const uploadJobDescriptionPDFAdmin = async (fileBuffer, fileName, userId) => {
    try {
        console.log('Storage bucket from env:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        console.log('Using bucket:', bucketName);

        if (!bucketName) {
            throw new Error('Storage bucket name not configured in environment variables');
        }

        const bucket = adminStorage.bucket(bucketName);
        console.log('Bucket initialized:', bucket.name);

        const filePath = `job_descriptions/${userId}/${fileName}`;
        console.log('Uploading to path:', filePath);

        const file = bucket.file(filePath);

        // Upload file
        await file.save(fileBuffer, {
            metadata: {
                contentType: 'application/pdf',
            },
        });

        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
        console.log('Upload successful. Public URL:', publicUrl);

        return publicUrl;

    } catch (error) {
        console.error('Detailed error:', error);
        throw new Error('Failed to upload file: ' + error.message);
    }
};