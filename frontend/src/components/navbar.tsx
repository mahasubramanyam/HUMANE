"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "About Us", href: "#about" },
  { label: "Our Impact", href: "#impact" },
  { label: "Get Involved", href: "#ecosystems" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-neutral-950/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-lg"
            : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tight text-white transition-opacity hover:opacity-90 flex items-center gap-2"
            aria-label="HUMANE Home"
          >
            <span>HUMANE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/85 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}

            {/* Sign In CTA button (Pill style matching reference video) */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-neutral-950 shadow-sm transition-all hover:bg-neutral-100 hover:shadow active:scale-95"
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden transition-opacity duration-300 flex flex-col justify-between pt-24 pb-8 px-6",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">
            Navigation
          </p>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-bold text-white hover:text-white/80 transition-colors py-2 border-b border-white/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#mission"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-white hover:text-white/80 transition-colors py-2 border-b border-white/10"
          >
            Our Mission
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-white hover:text-white/80 transition-colors py-2 border-b border-white/10"
          >
            How It Works
          </a>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/15">
          <Link
            href="/join"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-neutral-950 shadow hover:bg-neutral-100 transition-colors"
          >
            <span>Join HUMANE</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
}
