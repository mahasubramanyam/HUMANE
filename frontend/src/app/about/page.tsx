import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About HUMANE",
  description: "Learn about HUMANE — a connected social-impact platform for volunteers, NGOs and CSR partners.",
};

export default function AboutPage() {
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
        <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">About</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-6">About HUMANE</h1>
        <p className="text-base text-neutral-600 leading-relaxed mb-5">
          HUMANE is a greenfield, three-sided social-impact platform connecting volunteers, NGOs and CSR partners through shared infrastructure built on integrity, transparency and respect for human dignity.
        </p>
        <p className="text-base text-neutral-600 leading-relaxed mb-5">
          The platform is currently under active development. This page will expand as the product and organisation develop.
        </p>
        <p className="text-sm text-neutral-500">
          For enquiries, please visit our <Link href="/contact" className="underline underline-offset-2 hover:text-neutral-800">contact page</Link>.
        </p>
      </main>
    </div>
  );
}
