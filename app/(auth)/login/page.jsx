"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function LoginPage() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                emailOrPhone,
                password,
                redirect: false,
                callbackUrl
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.url) {
                router.push(result.url);
            } else {
                // Fallback redirect if NextAuth doesn't return URL
                router.push(callbackUrl);
            }
        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          SmartPantry Login
        </h2>
        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="emailOrPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Phone
            </label>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
