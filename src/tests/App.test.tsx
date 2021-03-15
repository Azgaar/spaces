import React from "react";
import { render as rtlRender, screen, within } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../components/App";

const render = (ui: JSX.Element, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return rtlRender(ui, { wrapper: Router });
};

test("renders app default page with sign in button", () => {
  render(<App />, { route: "/" });
  const main = screen.getByRole("main");
  const signIn = within(main).getByRole("button", { name: /sign in/i });
  expect(signIn).toBeInTheDocument();
});
