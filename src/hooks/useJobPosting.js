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

    // console.log("formData in hook:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

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
    setData(null);

    try {
      const response = await fetch('/api/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      console.log("Response", response);

      // Check if response is OK and has content
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content before parsing
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || !response.body) {
        throw new Error('Empty response from server');
      }

      const text = await response.text();

      // Check if text is not empty before parsing JSON
      if (!text.trim()) {
        throw new Error('Empty response body');
      }

      const result = JSON.parse(text);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create job posting');
      }

      setData(result);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to create job posting';
      setError(errorMessage);
      console.error('Job posting error:', err);
      throw new Error(errorMessage);
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