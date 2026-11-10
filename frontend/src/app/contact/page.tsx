import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — HUMANE",
  description: "Get in touch with the HUMANE team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-white border-b border-stone-200 py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-neutral-950 hover:opacity-80 transition-opacity">
            HUMANE
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
        <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">Contact</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-6">Contact Us</h1>
        <p className="text-base text-neutral-600 leading-relaxed mb-5">
          HUMANE is currently in development. Contact details and an enquiry form will be available at launch.
        </p>
        <p className="text-sm text-neutral-500">
          For early access or partnership enquiries, please check back soon.
        </p>
      </main>
    </div>
  );
}
