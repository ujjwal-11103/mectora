// src/app/page.jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      setIsRedirecting(true);
      router.push('/home');
    }
  }, [user, authLoading, router]);

  // ✅ Show loading state instead of early return
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Only render when we're sure user is not logged in
  if (user) {
    return null;
  }

  return (
    <div className="font-sans text-foreground">
      <Header />
      <Hero />
    </div>
  )
}

function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo (left) */}
        <Link href="/" className="flex items-center gap-2" aria-label="Mectora Home">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-[13px] font-black leading-none text-gray-900">
            M
          </div>
          <span className="text-lg font-semibold tracking-wide">MECTORA</span>
        </Link>

        {/* Center nav */}
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
            <li>
              <a className="relative block pb-1 text-gray-900" href="#">
                Home
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-10 rounded-full bg-indigo-600"
                />
              </a>
            </li>
            <li>
              <a className="transition hover:text-gray-900" href="#interview">
                Interview Preparation
              </a>
            </li>
            <li>
              <a className="transition hover:text-gray-900" href="#resume">
                Resume Builder
              </a>
            </li>
            <li>
              <a className="transition hover:text-gray-900" href="#pricing">
                Pricing
              </a>
            </li>
          </ul>
        </nav>

        {/* CTA (right) */}
        {user ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <SparkIcon className="h-4 w-4" />
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <SparkIcon className="h-4 w-4" />
            Try Now
          </Link>
        )}
      </div>
    </header>
  )
}

function Hero() {
  const { user } = useAuth();

  return (
    <main className="relative overflow-hidden">
      <BackgroundDecor />

      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 md:pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
            <PlusIcon className="h-3 w-3" />
          </span>
          Kickstart Your Career With Confidence
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-center text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
          <span className="block">Your AI-Powered</span>
          <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Career Coach
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-3xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
          Master interviews, build standout resumes, and connect with opportunities perfectly matched to your profile.
          One platform for your entire career journey.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Go to Dashboard
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Try Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          )}

          <Link
            href={user ? "/dashboard" : "#learn"}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {user ? "Dashboard" : "Learn More"}
          </Link>
        </div>

        {/* Trusted by */}
        <div className="mt-16 w-full">
          <p className="text-center text-sm font-medium text-gray-600">Mectora can help you to crack interviews at</p>

          <ul className="mx-auto mt-6 grid max-w-4xl grid-cols-3 items-center justify-items-center gap-6 text-gray-500 sm:grid-cols-6">
            <Logo name="Microsoft" color="#777" />
            <Logo name="Amazon" color="#777" />
            <Logo name="Meta" color="#777" />
            <Logo name="Apple" color="#777" />
            <Logo name="TCS" color="#777" />
            <Logo name="Infosys" color="#777" />
          </ul>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-gray-400">
            Logos are the property of their respective owners and are used here for illustrative purposes only. Mectora
            does not claim partnership or endorsement.
          </p>
        </div>
      </section>
    </main>
  )
}

function Logo({ name, color }) {
  return (
    <li className="flex items-center gap-2 opacity-80">
      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-sm font-semibold tracking-wide" style={{ color }}>
        {name}
      </span>
    </li>
  )
}

/* Background: soft gradient, faint diagonal lines, scattered dots to match the reference */
function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-indigo-50" />
      <div className="absolute left-1/2 top-24 -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="diag" width="200" height="200" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="200" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
              <line x1="40" y1="0" x2="40" y2="200" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>
      </div>
      <DecorDots />
    </div>
  )
}

function DecorDots() {
  const dots = [
    { top: 60, left: 80, size: 18, color: "rgba(99,102,241,0.25)" },
    { top: 120, left: "14%", size: 8, color: "rgba(99,102,241,0.22)" },
    { top: 140, right: 80, size: 20, color: "rgba(59,130,246,0.28)" },
    { top: 320, left: "8%", size: 10, color: "rgba(99,102,241,0.2)" },
    { top: 520, left: "12%", size: 10, color: "rgba(99,102,241,0.2)" },
    { top: 580, right: "10%", size: 14, color: "rgba(99,102,241,0.2)" },
    { top: 360, right: "14%", size: 8, color: "rgba(59,130,246,0.22)" },
  ]
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
          }}
        />
      ))}
    </>
  )
}

/* Simple inline icons */
function ArrowRightIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 010-1.414z" />
    </svg>
  )
}

function PlusIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9 4a1 1 0 112 0v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4z" />
    </svg>
  )
}

function SparkIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1l1.8 4.6L16 7l-4.2 1.4L10 13 8.2 8.4 4 7l4.2-1.4L10 1z" />
    </svg>
  )
}