import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../hero";

describe("Hero Component", () => {
  it("renders the primary headings, brand wordmark, and taglines", () => {
    render(<Hero />);
    expect(screen.getByText("Every Act of Kindness Matters")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "HUMANE", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Humanity begins with us.")).toBeInTheDocument();
    expect(
      screen.getByText("Connecting people, organisations and purpose to create meaningful social impact.")
    ).toBeInTheDocument();
  });

  it("renders both primary and secondary call-to-action buttons", () => {
    render(<Hero />);
    const joinButton = screen.getByRole("link", { name: /Join HUMANE/i });
    expect(joinButton).toBeInTheDocument();
    expect(joinButton).toHaveAttribute("href", "/join");

    const missionButton = screen.getByRole("link", { name: /Our Mission/i });
    expect(missionButton).toBeInTheDocument();
    expect(missionButton).toHaveAttribute("href", "#mission");
  });

  it("renders all 5 documentary collage background images with appropriate alt text", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("Children in a community setting smiling together")
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Volunteers unloading food aid supplies from a relief vehicle")
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Tender close-up of hands holding and comforting each other")
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Healthcare and aid volunteer distributing meal packages")
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Gentle elderly hands resting together in care")
    ).toBeInTheDocument();
  });

  it("renders the mobile composite background image", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("Humanitarian photographic collage depicting volunteers and community members")
    ).toBeInTheDocument();
  });

  it("applies alternating vertical animation classes and styles to the image panels", () => {
    const { container } = render(<Hero />);
    const upPanels = container.querySelectorAll(".hero-panel-up");
    const downPanels = container.querySelectorAll(".hero-panel-down");
    const subtlePanels = container.querySelectorAll(".hero-panel-subtle");

    // 3 panels alternate up (0, 2, 4) and 2 panels alternate down (1, 3)
    expect(upPanels.length).toBe(3);
    expect(downPanels.length).toBe(2);
    // Mobile composite uses subtle float
    expect(subtlePanels.length).toBe(1);
  });

  it("renders top and bottom gradient fades and central vignette overlays", () => {
    const { container } = render(<Hero />);
    const topFade = container.querySelector(".bg-gradient-to-b");
    const bottomFade = container.querySelector(".bg-gradient-to-t");
    expect(topFade).toBeInTheDocument();
    expect(bottomFade).toBeInTheDocument();
  });

  it("renders the scroll to discover link pointing to #about", () => {
    render(<Hero />);
    const scrollLink = screen.getByLabelText("Scroll down to About HUMANE section");
    expect(scrollLink).toBeInTheDocument();
    expect(scrollLink).toHaveAttribute("href", "#about");
  });
});
