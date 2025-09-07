// src/components/get-hired/JobFormStep1.jsx
"use client"
import { useState } from "react"
import { useJobPosting } from "@/hooks/useJobPosting"
import { useAuth } from "@/context/AuthContext"
import { Upload, FileText, Sparkles } from "lucide-react"

export default function JobFormStep1({ formData, setFormData, setParsedData, setCurrentStep }) {
    const { user } = useAuth()
    const [uploading, setUploading] = useState(false)
    const { parseJobDescription, loading, error } = useJobPosting()
    const [fileError, setFileError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFileError("")

        if (!formData.title) {
            alert("Job title is required")
            return
        }

        if (!formData.jdFile && !formData.jdText) {
            alert("Please provide either a job description file or text")
            return
        }

        const formDataToSend = new FormData()
        formDataToSend.append("jobTitle", formData.title)
        formDataToSend.append("userId", user.uid)
        if (formData.jdFile) formDataToSend.append("jdFile", formData.jdFile)
        if (formData.jdText) formDataToSend.append("jdText", formData.jdText)

        setUploading(true)

        try {
            const result = await parseJobDescription(formDataToSend)
            setParsedData(result.data)
            setFormData((prev) => ({
                ...prev,
                jdRawText: result.rawText,
                jdPdfUrl: result.jdPdfUrl || null,
                ...result.data,
            }))
            setCurrentStep(2)
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setUploading(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError("Please upload a PDF file")
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                setFileError("File size must be less than 5MB")
                return
            }
        }

        setFileError("")
        setFormData((prev) => ({ ...prev, jdFile: file }))
    }

    const isProcessing = loading || uploading

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Job Details
                    </h2>
                    <p className="text-gray-600 mt-2">Let's start with the basics of your job posting</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                        Job Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                            placeholder="e.g., Senior Frontend Developer"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-800">Job Description</label>
                    <p className="text-sm text-gray-600">Upload a PDF file or paste the job description text</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.jdFile
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <Upload className={`w-6 h-6 ${formData.jdFile ? "text-green-600" : "text-gray-400"}`} />
                                        <div className="text-center">
                                            {formData.jdFile ? (
                                                <div>
                                                    <p className="text-sm font-medium text-green-700">{formData.jdFile.name}</p>
                                                    <p className="text-xs text-green-600">File selected</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Upload PDF</p>
                                                    <p className="text-xs text-gray-500">Click or drag to upload</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {fileError && (
                                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                    <span>{fileError}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <FileText className="absolute top-4 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                                <textarea
                                    value={formData.jdText}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, jdText: e.target.value }))}
                                    rows={5}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                                    placeholder="Or paste job description here..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                    >
                        {isProcessing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 flex items-center justify-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            </div>
                        )}
                        <span className={isProcessing ? "opacity-0" : "opacity-100"}>Continue to Next Step →</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
