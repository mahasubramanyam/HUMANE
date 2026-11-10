import { Heart, Building2, Briefcase } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-stone-50 text-neutral-900 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">
            Why HUMANE Exists
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            Bridging the Gap Between Good Intentions and Real Ground Impact
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed">
            HUMANE is a shared social-impact ecosystem connecting volunteers, non-governmental organisations, and CSR partners. We do not make sweeping claims about solving every crisis; instead, we solve the coordination and trust friction that holds meaningful action back.
          </p>
        </div>

        {/* 3 Core Problem Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Volunteer Friction */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">For Volunteers</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Millions want to give their time and skills, but discovery is fragmented across scattered social feeds and opaque forms. Volunteers struggle to find vetted opportunities with clear schedules, safety assurances, and documented participation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                The Platform Answer:
              </span>
              <p className="text-xs text-neutral-600 mt-1">
                Verified mission matching, skill tracking, and portable service records without paywalls.
              </p>
            </div>
          </div>

          {/* Grassroots NGO Friction */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">For Grassroots NGOs</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Small and community-based NGOs deliver indispensable front-line work, yet struggle with visibility, volunteer coordination, and complex donor compliance. Most enterprise non-profit software locks essential tooling behind steep subscription paywalls.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                The Platform Answer:
              </span>
              <p className="text-xs text-neutral-600 mt-1">
                Zero artificial paywalls, streamlined volunteer operations, and dignity-first recordkeeping.
              </p>
            </div>
          </div>

          {/* CSR Partner Friction */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">For CSR Partners</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Corporate donors and CSR programs seek genuine social impact, but face accountability hurdles, administrative bottlenecks, and fabricated impact reports. Companies require audit-trailed partnerships without encroaching on NGO autonomy.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                The Platform Answer:
              </span>
              <p className="text-xs text-neutral-600 mt-1">
                Transparent partner matching, auditable milestones, and employee volunteering governance.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical Grounding Callout */}
        <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold">A Grounded, Honest Approach</h4>
            <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
              We do not replace human empathy with algorithms. Technology provides the transparent pipeline; human dedication drives the social transformation.
            </p>
          </div>
          <a
            href="#mission"
            className="shrink-0 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-stone-200 transition-colors"
          >
            Read Our Principles
          </a>
        </div>
      </div>
    </section>
  );
}
