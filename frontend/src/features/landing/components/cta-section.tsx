import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section
      id="cta-join"
      className="py-24 sm:py-32 bg-neutral-950 text-white text-center"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-xs uppercase tracking-widest font-bold text-amber-500 mb-4">
          Get Involved
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Be part of something meaningful.
        </h2>
        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed mb-10">
          Whether you give your time as a volunteer, run an organisation doing
          important work, or lead a corporate giving programme — HUMANE is
          designed to connect your efforts to lasting, honest impact.
        </p>
        <Link
          href="/join"
          className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-base font-bold text-neutral-950 shadow-lg hover:bg-stone-100 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          Join HUMANE
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-5 text-xs text-neutral-500">
          Registration of interest only. No fees. No spam.
        </p>
      </div>
    </section>
  );
}
