import React from "react";
import { render, screen, within } from "@testing-library/react";
import App from "../components/App";

test("renders app with Sign Up button", () => {
  render(<App />);
  const main = screen.getByRole("main");
  const signUp = within(main).getByRole("button", { name: /sign up/i });
  expect(signUp).toBeInTheDocument();
});
