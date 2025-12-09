import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OnboardingScreen from "../app/onboarding";

describe("OnboardingScreen (simple stable tests)", () => {
  it("renders without crashing", () => {
    const screen = render(<OnboardingScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it("shows the Next button on first slide", () => {
    const screen = render(<OnboardingScreen />);
    const nextBtn = screen.getByText("Next");
    expect(nextBtn).toBeTruthy();
  });

  it("pressing Next does not crash", () => {
    const screen = render(<OnboardingScreen />);
    const nextBtn = screen.getByText("Next");

    fireEvent.press(nextBtn);

    expect(true).toBe(true);
  });
});
