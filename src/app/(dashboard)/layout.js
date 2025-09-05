"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // your auth hook
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login"); // redirect to home/login if not authenticated
        }
    }, [user, router]);

    // while checking auth, you may want to show a loader (optional)
    if (user === undefined) {
        return <div className="flex min-h-screen items-center justify-center p-24">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>;
    }

    return (
        <div className="grid min-h-dvh grid-cols-[16rem_1fr] bg-slate-50">
            <Sidebar />
            <main className="px-6 py-6">{children}</main>
        </div>
    );
}
