"use client"
import { useState } from "react"
import { useJobPosting } from "@/hooks/useJobPosting"
import { MapPin, Building2, Clock, Users, Code, FileText } from "lucide-react"

export default function JobFormStep2({ formData, setFormData, parsedData, setCurrentStep }) {
  const { createJobPosting, loading, error } = useJobPosting()
  const [submitError, setSubmitError] = useState("")

  console.log("Form Data in comp2", formData)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")

    try {
      const result = await createJobPosting(formData)

      if (result.success) {
        setCurrentStep(3)
      } else {
        setSubmitError(result.error || "Failed to create job posting")
      }
    } catch (err) {
      setSubmitError(err.message || "An unexpected error occurred")
      console.error("Submission error:", err)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* <div className="p-2"> */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Job Details
          </h2>
          <p className="text-gray-600">Complete the job posting information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="inline w-4 h-4 mr-2 text-blue-500" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Remote, New York, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2 text-purple-500" />
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleChange("employmentType", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <option value="">Select type</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Users className="inline w-4 h-4 mr-2 text-green-500" />
                Work Mode
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => handleChange("workMode", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <option value="">Select mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Building2 className="inline w-4 h-4 mr-2 text-orange-500" />
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Code className="inline w-4 h-4 mr-2 text-indigo-500" />
              Skills Required
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                handleChange(
                  "skills",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="React, Node.js, Python (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FileText className="inline w-4 h-4 mr-2 text-teal-500" />
              Job Description Summary
            </label>
            <textarea
              value={formData.jdSummary}
              onChange={(e) => handleChange("jdSummary", e.target.value)}
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Job description summary..."
            />
          </div>

          {(error || submitError) && (
            <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 text-red-700 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="font-semibold">Error occurred</p>
              </div>
              <p className="ml-8">{error || submitError}</p>
              <p className="text-sm mt-2 ml-8 opacity-75">Please check the console for more details or try again.</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Posting Job...
                </span>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      {/* </div> */}
    </div>
  )
}
