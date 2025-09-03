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
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="grid min-h-dvh grid-cols-[16rem_1fr] bg-slate-50">
            <Sidebar />
            <main className="px-6 py-6">{children}</main>
        </div>
    );
}
