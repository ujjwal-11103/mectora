// src/app/get-hired/page.jsx
"use client"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import JobFormStep1 from "@/components/get-hired/JobFormStep1"
import JobFormStep2 from "@/components/get-hired/JobFormStep2"
import JobPostingSuccess from "@/components/get-hired/JobPostingSuccess"
import { CheckCircle, Circle } from "lucide-react"

export default function GetHiredPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 data
    title: "",
    jdFile: null,
    jdText: "",

    // Step 2 data (will be filled from API)
    location: "",
    employmentType: "",
    workMode: "",
    company: "",
    skills: [],
    jdSummary: "",
    jdRawText: "",
  })

  const [parsedData, setParsedData] = useState(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Circle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page</p>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Circle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
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
    3: <JobPostingSuccess
      setCurrentStep={setCurrentStep}
    />,
  }

  const stepLabels = ["Job Details", "Review & Edit", "Success"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="inset-0 opacity-30">
        <div className="inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
        <div className="top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Post a Job
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create and publish your job posting in just a few simple steps
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep > step
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
                        : currentStep === step
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg ring-4 ring-blue-500/20"
                          : "bg-gray-200 border-2 border-gray-300"
                        }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <span className={`text-sm font-bold ${currentStep === step ? "text-white" : "text-gray-500"}`}>
                          {step}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${currentStep >= step ? "text-gray-900" : "text-gray-500"
                        }`}
                    >
                      {stepLabels[index]}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 md:w-24 h-1 mx-4 rounded-full transition-all duration-500 ${currentStep > step ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            {steps[currentStep]}
          </div>
        </div>
      </div>
    </div>
  )
}
