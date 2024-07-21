import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// import { createServer } from '../test/server';
import NavBar from "./NavBar";

async function renderComponent() {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );
  screen.debug();
}

describe("when user is not signed in", () => {
  test("Log In button is visible", async () => {
    await renderComponent();
  });
});
