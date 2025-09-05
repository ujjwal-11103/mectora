// src/lib/storage.js
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload a PDF file to Firebase Storage
 * @param {File} file - The PDF file to upload
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string>} Download URL of the uploaded file
 */
export const uploadJobDescriptionPDF = async (file, userId) => {
    try {
        // Create a unique file name
        const timestamp = Date.now();
        const fileName = `jd_${timestamp}_${file.name}`;

        // Create storage reference
        const storageRef = ref(storage, `job_descriptions/${userId}/${fileName}`);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - The URL of the file to delete
 */
export const deleteFileFromStorage = async (fileUrl) => {
    // Note: Deleting files usually requires Admin SDK or Cloud Functions
    // This is a placeholder for future implementation
    console.log('File deletion would happen here for:', fileUrl);
};