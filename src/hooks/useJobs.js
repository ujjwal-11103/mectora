// src/hooks/useJobs.js
'use client';
import { useState, useEffect } from 'react';

export const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/jobs');

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const data = await response.json();
            if (data.success) {
                setJobs(data.jobs);
            } else {
                throw new Error(data.error || 'Failed to fetch jobs');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const recordApply = async (jobId) => {
        try {
            const response = await fetch(`/api/jobs/${jobId}/apply`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to record apply click');
            }

            const data = await response.json();
            return data.success;
        } catch (err) {
            console.error('Error recording apply:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, error, refetch: fetchJobs, recordApply };
};