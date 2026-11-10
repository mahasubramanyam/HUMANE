import Link from "next/link";
import { Heart, Building2, Briefcase, ArrowRight } from "lucide-react";

const ecosystems = [
  {
    id: "volunteer",
    icon: Heart,
    accent: "emerald",
    headline: "Volunteers",
    description:
      "Find meaningful opportunities matched to your skills, availability and location. Participate in programmes, contribute your expertise and build a verified record of community service.",
    points: [
      "Discover vetted opportunities near you",
      "Contribute skills across causes",
      "Build a portable service record",
      "Participate in your own time",
    ],
    cta: "Register as a Volunteer",
    href: "/join?type=volunteer",
    badge: "Free · Always",
  },
  {
    id: "ngo",
    icon: Building2,
    accent: "amber",
    headline: "NGOs & Organisations",
    description:
      "Manage programmes, publish volunteer opportunities, coordinate teams and maintain organisational records — without expensive enterprise software or paywalls that exclude grassroots groups.",
    points: [
      "Publish opportunities and recruit volunteers",
      "Manage programme rosters",
      "Maintain organisational records",
      "Access tools regardless of budget",
    ],
    cta: "Register Your Organisation",
    href: "/join?type=ngo",
    badge: "Essential access · Free",
  },
  {
    id: "csr",
    icon: Briefcase,
    accent: "blue",
    headline: "CSR Partners",
    description:
      "Discover implementing partners, support programmes with appropriate oversight, and follow project evidence and outcomes shared by NGOs — with NGO autonomy and beneficiary privacy protected throughout.",
    points: [
      "Find credible implementing partners",
      "Support missions with accountability",
      "Access appropriately shared evidence",
      "Coordinate employee volunteering",
    ],
    cta: "Enquire as a CSR Partner",
    href: "/join?type=csr",
    badge: "Platform launching soon",
  },
];

const accentMap: Record<
  string,
  {
    icon: string;
    badge: string;
    border: string;
    btn: string;
    dot: string;
    ring: string;
  }
> = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    border: "border-emerald-100 hover:border-emerald-200",
    btn: "bg-emerald-700 hover:bg-emerald-800 text-white",
    dot: "bg-emerald-500",
    ring: "focus-visible:ring-emerald-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    border: "border-amber-100 hover:border-amber-200",
    btn: "bg-amber-700 hover:bg-amber-800 text-white",
    dot: "bg-amber-500",
    ring: "focus-visible:ring-amber-500",
  },
  blue: {
    icon: "bg-blue-50 text-blue-700",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    border: "border-blue-100 hover:border-blue-200",
    btn: "bg-blue-700 hover:bg-blue-800 text-white",
    dot: "bg-blue-500",
    ring: "focus-visible:ring-blue-500",
  },
};

export function EcosystemsSection() {
  return (
    <section
      id="ecosystems"
      className="py-20 sm:py-28 bg-white text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">
            Three Connected Ecosystems
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            One Platform. Three Purposes.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed">
            HUMANE brings together three distinct communities on a shared,
            accountable infrastructure — with each group&apos;s independence and
            dignity preserved.
          </p>
        </div>

        {/* Ecosystem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ecosystems.map((eco) => {
            const Icon = eco.icon;
            const c = accentMap[eco.accent];
            return (
              <article
                key={eco.id}
                className={`flex flex-col bg-white rounded-2xl border ${c.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >
                <div className="p-8 flex flex-col flex-1">
                  {/* Icon + Badge row */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${c.icon}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${c.badge}`}
                    >
                      {eco.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {eco.headline}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {eco.description}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-2 mb-8 flex-1">
                    {eco.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`}
                        />
                        <span className="text-sm text-neutral-700">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={eco.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors ${c.btn} ${c.ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  >
                    {eco.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Transparency note */}
        <p className="mt-10 text-center text-xs text-neutral-500 max-w-xl mx-auto">
          HUMANE is currently in development. Registering your interest now
          helps us prioritise features and notify you at launch.
        </p>
      </div>
    </section>
  );
}
