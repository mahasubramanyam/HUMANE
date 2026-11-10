import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — HUMANE",
  description: "HUMANE privacy policy (draft, not legally reviewed).",
};

export default function PrivacyPage() {
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
          <strong>Draft — not legally reviewed.</strong> This privacy policy is a placeholder. It has not been reviewed by a legal professional and does not constitute legal advice or a binding privacy commitment.
        </div>
        <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-6">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none text-neutral-700 text-sm leading-relaxed space-y-5">
          <p>HUMANE is committed to protecting the privacy of volunteers, NGO staff, CSR partners and beneficiaries.</p>
          <p>Principles we are designing toward:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Volunteer and beneficiary personal data is never sold.</li>
            <li>Beneficiary data is processed only with informed, freely given consent.</li>
            <li>Data minimisation: we collect only what is necessary for the stated purpose.</li>
            <li>CSR partners do not receive unrestricted access to NGO internal records or volunteer personal information.</li>
            <li>Users may request access to, correction of, and deletion of their personal data.</li>
            <li>Security measures appropriate to the sensitivity of the data are applied.</li>
          </ul>
          <p>A full, legally reviewed privacy policy will be published before HUMANE opens to the public.</p>
        </div>
      </main>
    </div>
  );
}
