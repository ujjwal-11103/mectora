"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { CheckCircle, XCircle, Calendar, Clock, Shield, User, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { userProfile, loading } = useUserProfile()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // Show nothing while checking authentication
  if (!user) {
    return null
  }

  console.log("User :", user)
  console.log("UserProfile :", userProfile)
  console.log("UserProfile admin:", user.isAdmin)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative p-6 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's your account overview.</p>
              </div>
              <button
                onClick={logout}
                className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Logout
              </button>
            </div>

            <div className="grid gap-6 lg:gap-8">
              {/* Welcome Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user.email}!</h2>
                      <p className="text-gray-600 leading-relaxed">
                        You are successfully logged in and ready to explore all the features available to you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Email Verification Status */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      {userProfile?.emailVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <h3 className="font-semibold text-gray-800">Email Status</h3>
                    </div>
                    <p
                      className={`text-sm font-medium ${userProfile?.emailVerified ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {userProfile?.emailVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>

                {/* Account Created */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-800">Member Since</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{userProfile?.createdAt}</p>
                  </div>
                </div>

                {/* Last Login */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-800">Last Login</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{userProfile?.lastLoginAt}</p>
                  </div>
                </div>

                {/* Admin Status */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold text-gray-800">Account Type</h3>
                    </div>
                    <p className={`text-sm font-medium ${user.isAdmin ? "text-orange-600" : "text-gray-600"}`}>
                      {user.isAdmin ? "Administrator" : "Standard User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
