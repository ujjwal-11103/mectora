// src/app/get-hired/page.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import JobFormStep1 from '@/components/get-hired/JobFormStep1';
import JobFormStep2 from '@/components/get-hired/JobFormStep2';
import JobPostingSuccess from '@/components/get-hired/JobPostingSuccess';

export default function GetHiredPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 data
    title: '',
    jdFile: null,
    jdText: '',
    // applyUrl: '',
    
    // Step 2 data (will be filled from API)
    location: '',
    employmentType: '',
    workMode: '',
    company: '',
    skills: [],
    jdSummary: '',
    jdRawText: ''
  });

  const [parsedData, setParsedData] = useState(null);

  if (!user) {
    return <div>Please log in to access this page</div>;
  }

  const steps = {
    1: (
      <JobFormStep1
        formData={formData}
        setFormData={setFormData}
        setParsedData={setParsedData}
        setCurrentStep={setCurrentStep}
      />
    ),
    2: (
      <JobFormStep2
        formData={formData}
        setFormData={setFormData}
        parsedData={parsedData}
        setCurrentStep={setCurrentStep}
      />
    ),
    3: <JobPostingSuccess />
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h1>
            <div className="flex items-center mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {steps[currentStep]}
        </div>
      </div>
    </div>
  );
}