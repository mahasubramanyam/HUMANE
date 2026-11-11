import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "../shell";

describe("AppShell", () => {
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
});
