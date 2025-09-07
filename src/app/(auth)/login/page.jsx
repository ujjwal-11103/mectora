// src/app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push('/home');
        }
    }, [user, router]);

    // ✅ Move early return to the end, after ALL hooks
    if (user) {
        return (
            <div className="flex min-h-screen items-center justify-center p-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    // ✅ Now declare your functions
    const handleClose = () => {
        router.push('/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                if (displayName.trim()) {
                    await updateProfile(userCredential.user, {
                        displayName: displayName.trim()
                    });
                }

                await auth.currentUser.reload();
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return null;
    }

    return (
        <main className="min-h-dvh bg-muted/40 flex items-center justify-center p-4">
            <section
                aria-labelledby="login-title"
                className="w-full max-w-md rounded-xl bg-background shadow-lg ring-1 ring-black/5"
            >
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span aria-hidden className="h-6 w-1 rounded bg-indigo-600" />
                            <h1 id="login-title" className="text-pretty text-2xl font-semibold tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h1>
                        </div>
                        <button
                            type="button"
                            aria-label="Close"
                            className="rounded cursor-pointer p-1 text-muted-foreground hover:bg-muted/60"
                            onClick={() => handleClose()} // Add this onClick handler
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                className="opacity-70"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="mt-2 text-muted-foreground">
                        {isLogin ? 'Sign in to continue to your account' : 'Create a new account to get started'}
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Continue with Google */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="cursor-pointer mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                            <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.651,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657C33.046,6.053,28.723,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.817C14.431,16.108,18.855,12,24,12c3.059,0,5.842,1.153,7.961,3.039 l5.657-5.657C33.046,6.053,28.723,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24,44c5.176,0,9.86-1.977,13.409-5.197l-6.196-5.238C29.153,35.521,26.715,36,24,36 c-5.204,0-9.62-3.317-11.281-7.953l-6.54,5.036C9.49,39.556,16.227,44,24,44z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.236-2.231,4.152-3.994,5.562 c0.001-0.001,0.002-0.001,0.003-0.002l6.196,5.238C36.996,38.93,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="h-px flex-1 bg-border" />
                        <span>or continue with email</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {/* Display Name (only for registration) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                                    Display Name
                                </label>
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    required={!isLogin}
                                    placeholder="Enter your display name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                {isLogin && (
                                    <Link href="#" className="text-sm font-medium text-indigo-600 hover:underline">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded hover:bg-muted"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M2 2l20 20" />
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a11.44 11.44 0 0 1-5.17 5.94" />
                                            <path d="M6.61 6.61A11.42 11.42 0 0 0 2 12s3 7 10 7c1.57 0 3.06-.3 4.41-.84" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Footer link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setDisplayName('');
                                setError('');
                            }}
                            className="font-medium text-indigo-600 hover:underline"
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </section>
        </main>
    );
}