import { Search, Globe, Users, FileCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Globe,
    title: "Organisations Publish Missions",
    description:
      "NGOs post verified volunteer opportunities with clear scope, schedules and safeguarding information.",
  },
  {
    num: "02",
    icon: Search,
    title: "Volunteers Discover Opportunities",
    description:
      "People find meaningful work matched to their skills, location and availability — no gatekeeping.",
  },
  {
    num: "03",
    icon: Users,
    title: "Participation Happens",
    description:
      "Volunteers join missions and contribute on the ground. NGOs coordinate and communicate through the platform.",
  },
  {
    num: "04",
    icon: FileCheck,
    title: "Contributions Are Documented",
    description:
      "Service records are created with appropriate verification — no inflated figures, no fabricated reports.",
  },
  {
    num: "05",
    icon: BarChart3,
    title: "Outcomes Are Reported Honestly",
    description:
      "Evidence-backed progress updates are shared with relevant stakeholders, with acknowledged limitations and beneficiary privacy protected.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-neutral-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-500 mb-3">
            The Flow
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How HUMANE Works
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-400 leading-relaxed">
            A transparent, human-driven cycle — from mission publishing to
            honest outcome reporting.
          </p>
        </div>

        {/* Steps — vertical on mobile, horizontal on desktop */}
        <div className="relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden lg:block absolute top-[2.75rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-6 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li key={step.num} className="flex flex-col items-center text-center group">
                  {/* Step number circle */}
                  <div className="relative flex items-center justify-center mb-5">
                    {/* Connecting line left (desktop) */}
                    {idx > 0 && (
                      <div
                        className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-6 h-px bg-white/20"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative z-10 h-16 w-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition-all duration-300">
                      <Icon className="h-7 w-7 text-white/70 group-hover:text-amber-400 transition-colors duration-300" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-black text-amber-500/80 tracking-wider">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Ethical note */}
        <div className="mt-16 mx-auto max-w-2xl text-center p-6 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-sm text-neutral-400 leading-relaxed">
            <span className="font-semibold text-white">Human oversight always.</span>{" "}
            Verification, safeguarding and eligibility decisions involve
            appropriate human review — AI is a tool, not the decision-maker.
          </p>
        </div>
      </div>
    </section>
  );
}
