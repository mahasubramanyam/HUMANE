import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Building2, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Join HUMANE — Register Your Interest",
  description:
    "Register your interest in HUMANE as a volunteer, NGO or CSR partner. The platform is launching soon.",
};

const types = [
  {
    id: "volunteer",
    icon: Heart,
    label: "Volunteer",
    description:
      "Give your time and skills to meaningful causes near you.",
    accent: "emerald",
  },
  {
    id: "ngo",
    icon: Building2,
    label: "NGO / Organisation",
    description:
      "Register your organisation to access coordination tools and recruit volunteers.",
    accent: "amber",
  },
  {
    id: "csr",
    icon: Briefcase,
    label: "CSR Partner",
    description:
      "Connect your corporate giving programme with credible implementing partners.",
    accent: "blue",
  },
];

const accentClasses: Record<string, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function JoinPage() {
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
        <div className="max-w-2xl w-full text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">
            Platform Launching Soon
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">
            Join HUMANE
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed mb-10">
            Registration is coming soon. Select how you&apos;d like to get
            involved and leave your details — we&apos;ll notify you when we
            launch.
          </p>

          {/* Type cards (cosmetic only — no backend wiring) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {types.map((t) => {
              const Icon = t.icon;
              const cls = accentClasses[t.accent];
              return (
                <div
                  key={t.id}
                  className={`rounded-2xl border p-6 text-left ${cls} opacity-80 cursor-not-allowed`}
                  aria-disabled="true"
                >
                  <Icon className="h-6 w-6 mb-3" />
                  <h2 className="text-sm font-bold mb-1">{t.label}</h2>
                  <p className="text-xs leading-relaxed opacity-80">
                    {t.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-left">
            <p className="text-sm font-semibold text-neutral-900 mb-1">
              Interest registration
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Full registration will be available at launch. For now, you can
              reach us directly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 text-white px-7 py-3 text-sm font-bold hover:bg-neutral-800 transition-colors"
            >
              Contact Us to Register Interest
            </Link>
            <p className="mt-5 text-xs text-neutral-400">
              We do not sell your contact information. No spam.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
