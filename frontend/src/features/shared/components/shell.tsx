import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, ShieldCheck, Lock, Activity } from "lucide-react";
import { EcosystemCard } from "./ecosystem-card";

export function getApiHealthUrl(apiUrl?: string): string {
  let browserRuntimeUrl: string | undefined;
  if (typeof window !== "undefined") {
    const env = (
      window as unknown as {
        __HUMANE_ENV__?: { apiUrl?: string; NEXT_PUBLIC_API_URL?: string };
      }
    ).__HUMANE_ENV__;
    browserRuntimeUrl = env?.apiUrl || env?.NEXT_PUBLIC_API_URL;
  }

  const rawBase = (
    apiUrl ??
    browserRuntimeUrl ??
    process.env.HUMANE_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1")
  )
    .trim()
    .replace(/\/+$/, "");

  const base =
    rawBase ||
    (process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1");

  return base.endsWith("/api/v1") ? `${base}/health` : `${base}/api/v1/health`;
}

export function AppShell() {
  const healthUrl = getApiHealthUrl();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">HUMANE</span>
            <Badge variant="outline" className="text-[10px] tracking-widest uppercase">
              Foundation
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>Platform Core Online</span>
            </div>
            <a href={healthUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                API Health
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Overview */}
      <main className="flex-1">
        <section className="py-12 md:py-20 border-b bg-muted/20">
          <div className="container mx-auto px-4 sm:px-8 text-center max-w-4xl">
            <Badge variant="secondary" className="mb-4">
              Greenfield Architecture Initialized
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              A Connected Three-Sided Social-Impact Platform
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              HUMANE connects Volunteers, NGOs, and CSR Partners under unified infrastructure,
              shared security, verified consent, and human-in-the-loop safeguards.
            </p>
          </div>
        </section>

        {/* Three Ecosystems Showcase */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <EcosystemCard
                title="Volunteers"
                badge="Free & Dignified Access"
                badgeVariant="volunteer"
                description="Grassroots participants providing skills, labor, and community empathy. Protected by strict privacy guarantees."
                principles={[
                  "Essential volunteer access is permanently free",
                  "Personal data is never sold or exploited",
                  "Granular consent on every participation grant",
                ]}
              />

              <EcosystemCard
                title="NGOs & Implementers"
                badge="Zero Paywall Barrier"
                badgeVariant="ngo"
                description="Community-based and grassroots non-profits driving real change without predatory subscription barriers."
                principles={[
                  "Grassroots NGOs never blocked by artificial paywalls",
                  "Beneficiary dignity and privacy rigorously protected",
                  "Human-reviewed verification and safeguarding checks",
                ]}
              />

              <EcosystemCard
                title="CSR Partners"
                badge="Verified Impact & Governance"
                badgeVariant="csr"
                description="Corporate partners investing capital and employee engagement with auditable proof of outcome."
                principles={[
                  "Auditable, tamper-evident impact reporting",
                  "Strict tenant isolation from internal NGO records",
                  "No fabricated metrics or synthetic dashboards",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Platform Guarantees */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Core Architecture & Trust Guarantees</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Foundational rules enforced by server-side identity, session management, and immutable audit logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Server-Side Session Security</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    HTTP-only, SameSite cookies with SHA-256 session token hashing and server-side RBAC enforcement.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Safeguarding & Human Review</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI assists workflows but never independently makes legal, financial, or safeguarding determinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} HUMANE Social-Impact Platform. Foundation Phase.</p>
          <div className="flex items-center gap-6">
            <span>Next.js 15 (App Router)</span>
            <span>&bull;</span>
            <span>FastAPI Modular Monolith</span>
            <span>&bull;</span>
            <span>PostgreSQL &amp; Alembic</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
