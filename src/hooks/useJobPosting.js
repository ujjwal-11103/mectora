// src/hooks/useJobPosting.js
'use client';
import { useState } from 'react';

export const useJobPosting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const parseJobDescription = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/parse-job', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse job description');
      }

      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createJobPosting = async (jobData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create job posting');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    parseJobDescription,
    createJobPosting,
    loading,
    error,
    parsedData: data?.data,
    rawText: data?.rawText
  };
};