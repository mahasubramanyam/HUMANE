import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — HUMANE",
  description: "HUMANE terms of service (draft, not legally reviewed).",
};

export default function TermsPage() {
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
        <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm">
          <strong>Draft — not legally reviewed.</strong> These terms are a placeholder and have not been reviewed by a legal professional. They do not constitute a binding agreement.
        </div>
        <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-6">Terms of Service</h1>
        <div className="prose prose-stone max-w-none text-neutral-700 text-sm leading-relaxed space-y-5">
          <p>HUMANE is a platform connecting volunteers, NGOs and CSR partners. Use of this platform is subject to these terms, which will be fully defined before public launch.</p>
          <p>Principles we are designing toward:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Users must not use the platform to harm, exploit or deceive any person.</li>
            <li>Organisations must represent themselves accurately.</li>
            <li>Volunteers participate of their own free will; no coercion is permitted.</li>
            <li>Beneficiary welfare and dignity take precedence over platform metrics.</li>
            <li>Fabricating impact data, verification records or organisational credentials is strictly prohibited.</li>
          </ul>
          <p>Comprehensive, legally reviewed terms of service will be published before HUMANE opens to the public.</p>
        </div>
      </main>
    </div>
  );
}
