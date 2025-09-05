// src/components/get-hired/JobFormStep1.jsx
'use client';
import { useState } from 'react';
import { useJobPosting } from '@/hooks/useJobPosting';
import { useAuth } from '@/context/AuthContext'; // ← Add this import


export default function JobFormStep1({ formData, setFormData, setParsedData, setCurrentStep }) {
    const { user } = useAuth(); // ← Get current user
    const [uploading, setUploading] = useState(false);
    const { parseJobDescription, loading, error } = useJobPosting();
    const [fileError, setFileError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFileError('');

        if (!formData.title) {
            alert('Job title is required');
            return;
        }

        if (!formData.jdFile && !formData.jdText) {
            alert('Please provide either a job description file or text');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('jobTitle', formData.title);
        formDataToSend.append('userId', user.uid); // ← Add user ID for storage path
        if (formData.jdFile) formDataToSend.append('jdFile', formData.jdFile);
        if (formData.jdText) formDataToSend.append('jdText', formData.jdText);

        setUploading(true);

        try {
            const result = await parseJobDescription(formDataToSend);
            setParsedData(result.data);
            setFormData(prev => ({
                ...prev,
                jdRawText: result.rawText,
                jdPdfUrl: result.jdPdfUrl || null, // ← Store the PDF URL
                ...result.data
            }));
            setCurrentStep(2);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (file.type !== 'application/pdf') {
                setFileError('Please upload a PDF file');
                return;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setFileError('File size must be less than 5MB');
                return;
            }
        }

        setFileError('');
        setFormData(prev => ({ ...prev, jdFile: file }));
    };

    const isProcessing = loading || uploading;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Frontend Developer"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (File or Text)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Upload PDF</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Or paste text</label>
                        <textarea
                            value={formData.jdText}
                            onChange={(e) => setFormData(prev => ({ ...prev, jdText: e.target.value }))}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Paste job description here..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isProcessing ? 'Processing...' : 'Next →'}
            </button>

            {uploading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md">
                    <p>Uploading PDF file...</p>
                </div>
            )}
        </form>
    );
}