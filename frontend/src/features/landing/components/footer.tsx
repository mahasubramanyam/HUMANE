import Link from "next/link";

const footerLinks = {
  About: [
    { label: "About HUMANE", href: "/about" },
    { label: "Our Mission", href: "#mission" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  "Get Involved": [
    { label: "Volunteer", href: "/join?type=volunteer" },
    { label: "Register an NGO", href: "/join?type=ngo" },
    { label: "CSR Partnership", href: "/join?type=csr" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Contact: [
    { label: "Contact Us", href: "/contact" },
    { label: "Sign In", href: "/login" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-white hover:opacity-90 transition-opacity"
              aria-label="HUMANE Home"
            >
              HUMANE
            </Link>
            <p className="mt-3 text-sm text-stone-400 max-w-xs leading-relaxed">
              Humanity begins with us.
            </p>
            <p className="mt-4 text-xs text-stone-500 max-w-xs leading-relaxed">
              A connected social-impact platform for volunteers, NGOs and CSR
              partners. Currently in development.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} HUMANE. Building a more connected
            social impact ecosystem.
          </p>
          <p className="text-stone-600">
            Volunteer and beneficiary data is never sold.
          </p>
        </div>
      </div>
    </footer>
  );
}
