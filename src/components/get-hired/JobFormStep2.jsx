// src/components/get-hired/JobFormStep2.jsx
'use client';
import { useState } from 'react';
import { useJobPosting } from '@/hooks/useJobPosting';

export default function JobFormStep2({ formData, setFormData, parsedData, setCurrentStep }) {
  const { createJobPosting, loading, error } = useJobPosting();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createJobPosting(formData);
      setCurrentStep(3);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="e.g., Remote, New York, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => handleChange('employmentType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Mode
          </label>
          <select
            value={formData.workMode}
            onChange={(e) => handleChange('workMode', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills Required
        </label>
        <input
          type="text"
          value={formData.skills.join(', ')}
          onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="React, Node.js, Python (comma separated)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description Summary
        </label>
        <textarea
          value={formData.jdSummary}
          onChange={(e) => handleChange('jdSummary', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Job description summary..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Posting Job...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
}