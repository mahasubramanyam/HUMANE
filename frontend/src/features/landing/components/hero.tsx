import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

const heroPanels = [
  {
    src: "/images/hero/panel_1.jpg",
    alt: "Children in a community setting smiling together",
    label: "Community",
  },
  {
    src: "/images/hero/panel_2.jpg",
    alt: "Volunteers unloading food aid supplies from a relief vehicle",
    label: "Relief",
  },
  {
    src: "/images/hero/panel_3.jpg",
    alt: "Tender close-up of hands holding and comforting each other",
    label: "Empathy",
  },
  {
    src: "/images/hero/panel_4.jpg",
    alt: "Healthcare and aid volunteer distributing meal packages",
    label: "Support",
  },
  {
    src: "/images/hero/panel_5.jpg",
    alt: "Gentle elderly hands resting together in care",
    label: "Dignity",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden bg-neutral-950 pt-20 pb-10"
      aria-label="HUMANE Hero Overview"
    >
      {/* Background Photographic Composition: 5-column documentary collage */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none" aria-hidden="true">
        {/* Desktop 5-panel layout */}
        <div className="hidden md:grid grid-cols-5 h-full w-full">
          {heroPanels.map((panel, idx) => (
            <div key={idx} className="relative h-full w-full overflow-hidden border-r border-white/5 last:border-r-0">
              <Image
                src={panel.src}
                alt={panel.alt}
                fill
                priority={idx < 3}
                sizes="20vw"
                className="object-cover object-center transform transition-transform duration-1000 ease-out hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Mobile / Tablet composite layout (prevents narrow column distortion on smaller screens) */}
        <div className="md:hidden relative h-full w-full">
          <Image
            src="/images/hero/hero-collage.jpg"
            alt="Humanitarian photographic collage depicting volunteers and community members"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Dark Translucent Overlay & Subtle Vignette for Maximum Contrast */}
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-brightness-75 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />
      </div>

      {/* Top Spacer for Navigation Clearance */}
      <div className="h-10 sm:h-16 w-full" aria-hidden="true" />

      {/* Main Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Uppercase Introductory Phrase */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-white/90 drop-shadow-sm mb-3 sm:mb-4">
          Every Act of Kindness Matters
        </p>

        {/* Hero Wordmark (HUMANE) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white select-none drop-shadow-md leading-none">
          HUMANE
        </h1>

        {/* Emotional Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/95 mt-4 sm:mt-6 tracking-normal drop-shadow-sm">
          Humanity begins with us.
        </p>

        {/* Supporting Clarifying Text */}
        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto mt-3 leading-relaxed drop-shadow-sm">
          Connecting people, organisations and purpose to create meaningful social impact.
        </p>

        {/* Action Buttons matching reference video */}
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
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/80 bg-black/20 backdrop-blur-sm px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all hover:bg-white/15 hover:border-white active:scale-95"
          >
            Our Mission
          </a>
        </div>
      </div>

      {/* Bottom Scroll Indicator matching reference video */}
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
