"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, FileText, BookOpen, BriefcaseBusiness, Settings, HelpCircle, LogOut, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Resume Builder", href: "/resume-builder", icon: FileText },
    { label: "Interview Prep", href: "/interview-prep", icon: BookOpen },
    { label: "Browse Jobs", href: "/all-jobs", icon: BriefcaseBusiness },
    { label: "Get Hired", href: "/get-hired", icon: UserPlus },
    { label: "Profile Setting", href: "/profile-setting", icon: Settings },
    { label: "Help", href: "/help", icon: HelpCircle },
]

export function Sidebar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleClose = async () => {
        try {
            await logout()
            router.push("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between border-r border-white/20 bg-gradient-to-b from-slate-50 via-white to-slate-50 backdrop-blur-xl shadow-xl"
            aria-label="Sidebar"
        >
            {/* Top section: avatar + nav */}
            <div className="overflow-y-auto">
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-6 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30 shadow-lg">
                            <Image src={user?.photoURL || "/user.jpg"} alt="User avatar" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{user?.displayName}</p>
                            <p className="truncate text-xs text-white/80">Welcome back</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="mt-4 px-4">
                    <ul className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            if (item.label === "Get Hired" && !user?.isAdmin) {
                                return null
                            }

                            const Icon = item.icon
                            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                            "outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500",
                                            "hover:shadow-md hover:scale-[1.02] transform",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                                : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700",
                                        )}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-5 w-5 transition-colors duration-200",
                                                isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600",
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>

            {/* Logout button */}
            <div className="p-4">
                <button
                    type="button"
                    className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        "border-2 border-gradient-to-r from-gray-200 to-gray-300 text-gray-700",
                        "hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 hover:border-red-200",
                        "hover:shadow-md hover:scale-[1.02] transform",
                        "outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-red-500",
                    )}
                    onClick={handleClose}
                    aria-label="Log out"
                >
                    <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                    <span className="truncate">Log out</span>
                </button>
            </div>
        </aside>
    )
}
