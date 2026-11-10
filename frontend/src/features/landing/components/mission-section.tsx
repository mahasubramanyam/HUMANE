import {
  HeartHandshake,
  Scale,
  ShieldCheck,
  Eye,
  Users,
  Lock,
  Handshake,
} from "lucide-react";

const principles = [
  {
    icon: HeartHandshake,
    title: "Humanity and Dignity First",
    description:
      "Every decision is grounded in the inherent dignity of every person. Beneficiaries are never reduced to data points or publicity material.",
  },
  {
    icon: Scale,
    title: "Equal Access for All Organisations",
    description:
      "Grassroots and small NGOs must not be excluded by paywalls. Essential organisational tools remain accessible regardless of budget.",
  },
  {
    icon: ShieldCheck,
    title: "Volunteer Safety",
    description:
      "Volunteers receive clear safeguarding information before participation. Safety concerns are taken seriously and escalated appropriately.",
  },
  {
    icon: Eye,
    title: "Transparency and Accountability",
    description:
      "Outcomes are reported with evidence and acknowledged limitations. Fabricated metrics undermine trust — HUMANE never inflates or invents impact.",
  },
  {
    icon: Lock,
    title: "Beneficiary Privacy and Consent",
    description:
      "Personal data is never sold. Photographs, stories and records involving beneficiaries require informed consent. Assistance is never conditional on publicity.",
  },
  {
    icon: Users,
    title: "NGO Independence",
    description:
      "CSR partners do not gain unrestricted access to NGO internal records or operational decisions. Organisational autonomy is structurally protected.",
  },
  {
    icon: Handshake,
    title: "Responsible Collaboration",
    description:
      "Partnerships are built on mutual respect. No party — commercial, governmental or otherwise — may use the platform to compromise beneficiary welfare.",
  },
];

export function MissionSection() {
  return (
    <section
      id="mission"
      className="py-20 sm:py-28 bg-stone-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-3">
            Our Mission and Principles
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            What We Stand For
          </h2>
          <p className="mt-5 text-base sm:text-lg text-stone-300 leading-relaxed">
            HUMANE is not neutral technology. These principles are built into
            how the platform is designed, what data is collected, and how
            decisions are made.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Important Principle Callout */}
        <div className="mt-10 max-w-3xl mx-auto p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
          <p className="text-sm text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-300">Critical boundary:</span>{" "}
            Humanitarian assistance is never conditional on beneficiaries being
            photographed, filmed or publicly identified. Consent is always free,
            informed and reversible.
          </p>
        </div>
      </div>
    </section>
  );
}
