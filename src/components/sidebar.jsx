"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    BookOpen,
    BriefcaseBusiness,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Resume Builder", href: "/resume-builder", icon: FileText },
    { label: "Interview Prep", href: "/interview-prep", icon: BookOpen },
    { label: "Get Hired", href: "/get-hired", icon: BriefcaseBusiness },
    { label: "Profile Setting", href: "/profile-setting", icon: Settings },
    { label: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleClose = async () => {
        try {
            await logout();  // ✅ Properly call and wait for logout
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Optional: Show error message to user
        }
    }

    return (
        <aside
            className="flex h-full w-64 flex-col border-r bg-white"
            aria-label="Sidebar"
        >
            {/* Header: avatar + name */}
            <div className="flex items-center gap-3 p-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
                    <Image
                        src={"/user.jpg"}
                        alt="User avatar"
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{user?.displayName}</p>
                    <p className="truncate text-xs text-gray-500">Welcome back</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="mt-2 flex-1 px-3">
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" && pathname?.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                                        "outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                                            : "text-gray-700 hover:bg-gray-50"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon
                                        className={cn(
                                            "h-5 w-5",
                                            isActive
                                                ? "text-blue-600"
                                                : "text-gray-500 group-hover:text-gray-700"
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout button fixed at bottom */}
            <div className="p-3">
                <button
                    type="button"
                    className={cn(
                        "group flex w-full items-center gap-3 rounded-md border px-3 py-2 text-sm transition",
                        "border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
                        "outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                    )}
                    onClick={handleClose} // ✅ Use the corrected handler
                    aria-label="Log out"
                >
                    <LogOut className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                    <span className="truncate">Log out</span>
                </button>
            </div>
        </aside>
    );
}