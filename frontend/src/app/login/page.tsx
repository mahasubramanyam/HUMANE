import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — HUMANE",
  description: "Secure authentication for the HUMANE platform. Under development.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-neutral-950 hover:opacity-80 transition-opacity"
          >
            HUMANE
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 text-center">
            <div className="h-14 w-14 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-3">
              Sign In to HUMANE
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed mb-8">
              Secure, server-side authentication is under active development.
              Account access will be available at platform launch.
            </p>
            <p className="text-xs text-neutral-500 mb-6">
              If you need early access or have an existing arrangement, please{" "}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-neutral-800 transition-colors"
              >
                contact us
              </Link>
              .
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 text-white px-7 py-3 text-sm font-bold hover:bg-neutral-800 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
