"use client"
import { useRouter } from "next/navigation"
import { CheckCircle, Plus, Home } from "lucide-react"

export default function JobPostingSuccess({ setCurrentStep }) {
    const router = useRouter()

    return (
        <div className="max-w-2xl mx-auto">
            <div className="p-12 text-center">
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400/30 to-emerald-600/30 rounded-full mx-auto animate-ping"></div>
                </div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                    Job Posted Successfully!
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Your job posting has been created and is now live.
                    <br />
                    Candidates can start applying immediately.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Post Another Job
                    </button>
                    <button
                        onClick={() => router.push("/home")}
                        className="flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-8 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </button>
                </div>

                <div className="mt-8 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
            </div>
        </div>
    )
}
