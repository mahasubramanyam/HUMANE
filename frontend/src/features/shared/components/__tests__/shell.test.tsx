import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell, getApiHealthUrl } from "../shell";

describe("AppShell", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders the HUMANE brand and foundation status", () => {
    render(<AppShell />);
    expect(screen.getByText("HUMANE")).toBeInTheDocument();
    expect(screen.getByText("Foundation")).toBeInTheDocument();
  });

  it("renders the three ecosystem cards (Volunteers, NGOs, CSR)", () => {
    render(<AppShell />);
    expect(screen.getByText("Volunteers")).toBeInTheDocument();
    expect(screen.getByText("NGOs & Implementers")).toBeInTheDocument();
    expect(screen.getByText("CSR Partners")).toBeInTheDocument();
  });

  it("highlights non-negotiable product principles", () => {
    render(<AppShell />);
    expect(
      screen.getByText("Essential volunteer access is permanently free")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Grassroots NGOs never blocked by artificial paywalls")
    ).toBeInTheDocument();
  });

  it("points API Health link to NEXT_PUBLIC_API_URL when configured and falls back to localhost for local dev", () => {
    expect(getApiHealthUrl(undefined)).toBe(
      "http://localhost:8000/api/v1/health"
    );
    expect(
      getApiHealthUrl(
        "https://humane-api.env.malaysiawest.azurecontainerapps.io/api/v1"
      )
    ).toBe(
      "https://humane-api.env.malaysiawest.azurecontainerapps.io/api/v1/health"
    );
    expect(
      getApiHealthUrl(
        "https://humane-api.env.malaysiawest.azurecontainerapps.io/"
      )
    ).toBe(
      "https://humane-api.env.malaysiawest.azurecontainerapps.io/api/v1/health"
    );

    vi.stubEnv(
      "NEXT_PUBLIC_API_URL",
      "https://humane-api.env.malaysiawest.azurecontainerapps.io/api/v1"
    );
    render(<AppShell />);
    const healthLink = screen.getByRole("link", { name: /API Health/i });
    expect(healthLink).toHaveAttribute(
      "href",
      "https://humane-api.env.malaysiawest.azurecontainerapps.io/api/v1/health"
    );
  });

  it("resolves API Health link using server-only HUMANE_API_URL runtime variable", () => {
    vi.stubEnv(
      "HUMANE_API_URL",
      "https://humane-api.proudsky-12345.malaysiawest.azurecontainerapps.io/api/v1"
    );
    expect(getApiHealthUrl()).toBe(
      "https://humane-api.proudsky-12345.malaysiawest.azurecontainerapps.io/api/v1/health"
    );

    // Also verify when HUMANE_API_URL has no /api/v1 suffix
    vi.stubEnv(
      "HUMANE_API_URL",
      "https://humane-api.proudsky-12345.malaysiawest.azurecontainerapps.io"
    );
    expect(getApiHealthUrl()).toBe(
      "https://humane-api.proudsky-12345.malaysiawest.azurecontainerapps.io/api/v1/health"
    );
  });

  it("prioritizes browser runtime window.__HUMANE_ENV__ injection over compile-time environment", () => {
    (
      window as unknown as {
        __HUMANE_ENV__: { apiUrl: string };
      }
    ).__HUMANE_ENV__ = {
      apiUrl: "https://humane-api-runtime.azurecontainerapps.io/api/v1",
    };

    expect(getApiHealthUrl()).toBe(
      "https://humane-api-runtime.azurecontainerapps.io/api/v1/health"
    );

    delete (
      window as unknown as {
        __HUMANE_ENV__?: { apiUrl?: string; NEXT_PUBLIC_API_URL?: string };
      }
    ).__HUMANE_ENV__;
  });

  it("never falls back to localhost in production mode when runtime and build URLs are unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("HUMANE_API_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    expect(getApiHealthUrl()).toBe("/api/v1/health");
  });
});
