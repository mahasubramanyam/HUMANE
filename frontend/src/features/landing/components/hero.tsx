import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

interface HeroPanel {
  src: string;
  alt: string;
  label: string;
  direction: "up" | "down";
  duration: number;
  delay: number;
}

const heroPanels: HeroPanel[] = [
  {
    src: "/images/hero/panel_1.jpg",
    alt: "Children in a community setting smiling together",
    label: "Community",
    direction: "up",
    duration: 16,
    delay: 0,
  },
  {
    src: "/images/hero/panel_2.jpg",
    alt: "Volunteers unloading food aid supplies from a relief vehicle",
    label: "Relief",
    direction: "down",
    duration: 18,
    delay: -4,
  },
  {
    src: "/images/hero/panel_3.jpg",
    alt: "Tender close-up of hands holding and comforting each other",
    label: "Empathy",
    direction: "up",
    duration: 15,
    delay: -8,
  },
  {
    src: "/images/hero/panel_4.jpg",
    alt: "Healthcare and aid volunteer distributing meal packages",
    label: "Support",
    direction: "down",
    duration: 17,
    delay: -5,
  },
  {
    src: "/images/hero/panel_5.jpg",
    alt: "Gentle elderly hands resting together in care",
    label: "Dignity",
    direction: "up",
    duration: 14,
    delay: -10,
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden bg-neutral-950 pt-20 pb-10"
      aria-label="HUMANE Hero Overview"
    >
      {/* Background Photographic Composition: 5-column documentary collage with continuous vertical motion */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Desktop 5-panel layout with staggered, continuous vertical drifting */}
        <div className="hidden md:grid grid-cols-5 h-full w-full">
          {heroPanels.map((panel, idx) => (
            <div
              key={idx}
              className="relative h-full w-full overflow-hidden border-r border-white/10 last:border-r-0"
            >
              {/* Animated inner wrapper with vertical over-bleed to prevent edge clipping during motion */}
              <div
                className={`absolute -top-[10%] -bottom-[10%] left-0 right-0 w-full h-[120%] will-change-transform ${
                  panel.direction === "up" ? "hero-panel-up" : "hero-panel-down"
                }`}
                style={{
                  animationDuration: `${panel.duration}s`,
                  animationDelay: `${panel.delay}s`,
                }}
              >
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  priority={idx < 3}
                  sizes="20vw"
                  className="object-cover object-center brightness-[1.08] contrast-[1.08] saturate-[1.08] transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet composite layout with subtle gentle movement */}
        <div className="md:hidden relative h-full w-full overflow-hidden">
          <div
            className="absolute -top-[8%] -bottom-[8%] left-0 right-0 w-full h-[116%] will-change-transform hero-panel-subtle"
            style={{ animationDuration: "18s" }}
          >
            <Image
              src="/images/hero/hero-collage.jpg"
              alt="Humanitarian photographic collage depicting volunteers and community members"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[1.08] contrast-[1.08] saturate-[1.08]"
            />
          </div>
        </div>

        {/* 1. Top Edge Gradient: Navbar clearance, readable navigation links, and elegant visual fade */}
        <div className="absolute top-0 inset-x-0 h-32 sm:h-44 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-transparent pointer-events-none z-[1]" />

        {/* 2. Bottom Edge Gradient: Soft visual dissolve into subsequent sections */}
        <div className="absolute bottom-0 inset-x-0 h-40 sm:h-60 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent pointer-events-none z-[1]" />

        {/* 3. Subtle Central Radial Dark Vignette: Balanced 0.42 central opacity and 0.12-0.18 outer opacity for bright, detailed, natural photography */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,10,10,0.42)_0%,_rgba(10,10,10,0.25)_50%,_rgba(10,10,10,0.12)_80%,_rgba(10,10,10,0.18)_100%)] pointer-events-none z-[1]" />
      </div>

      {/* Top Spacer for Navigation Clearance */}
      <div className="h-10 sm:h-16 w-full" aria-hidden="true" />

      {/* Main Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Uppercase Introductory Phrase */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mb-3 sm:mb-4">
          Every Act of Kindness Matters
        </p>

        {/* Hero Wordmark (HUMANE) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] leading-none">
          HUMANE
        </h1>

        {/* Emotional Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/95 mt-4 sm:mt-6 tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          Humanity begins with us.
        </p>

        {/* Supporting Clarifying Text */}
        <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto mt-3 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          Connecting people, organisations and purpose to create meaningful social impact.
        </p>

        {/* Action Buttons matching reference design */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: Join HUMANE */}
          <Link
            href="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm sm:text-base font-bold text-neutral-950 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Join HUMANE</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Secondary CTA: Our Mission */}
          <a
            href="#mission"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/80 bg-black/30 backdrop-blur-md px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all hover:bg-white/20 hover:border-white active:scale-95"
          >
            Our Mission
          </a>
        </div>
      </div>

      {/* Bottom Scroll Indicator matching reference design */}
      <div className="relative z-10 flex flex-col items-center mt-8 sm:mt-12 text-white/80 transition-colors hover:text-white">
        <a
          href="#about"
          className="flex flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-full p-2"
          aria-label="Scroll down to About HUMANE section"
        >
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/70">
            Scroll to Discover
          </span>
          <ArrowDown className="h-4 w-4 motion-safe:animate-bounce text-white/80" />
        </a>
      </div>
    </section>
  );
}
