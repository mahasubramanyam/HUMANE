import { Sprout, BookOpen, Link2 } from "lucide-react";

const intentions = [
  {
    icon: Sprout,
    title: "Grassroots Organisations Gaining Visibility",
    description:
      "Smaller NGOs doing critical front-line work are often invisible to volunteers and funders. HUMANE intends to give them a credible, accessible presence alongside larger organisations — without favouring those with marketing budgets.",
  },
  {
    icon: BookOpen,
    title: "Volunteers Finding Meaningful Participation",
    description:
      "People want to contribute beyond token gestures. HUMANE intends to connect them to substantive opportunities that match their skills and schedules, with clear expectations and honest outcomes.",
  },
  {
    icon: Link2,
    title: "Accountable, Respectful Partnerships",
    description:
      "CSR collaboration with NGOs should produce genuine impact, not just compliance reports. HUMANE intends to provide the accountability infrastructure that makes such partnerships honest — with NGO autonomy and beneficiary privacy always protected.",
  },
];

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="py-20 sm:py-28 bg-stone-50 text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">
            Our Impact
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            What HUMANE Intends to Support
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed">
            We are in development. Rather than inventing numbers, we describe
            the kinds of outcomes we are building toward — honestly.
          </p>
        </div>

        {/* Intention cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {intentions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Honesty commitment */}
        <div className="mt-14 max-w-2xl mx-auto text-center">
          <p className="text-sm text-neutral-500 leading-relaxed border-t border-stone-200 pt-8">
            When HUMANE is live and operating, real outcomes will be reported
            here with evidence, methodology and acknowledged limitations — not
            polished marketing copy.
          </p>
        </div>
      </div>
    </section>
  );
}
