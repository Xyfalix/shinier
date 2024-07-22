import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";
import "@testing-library/jest-dom";

async function renderComponent(user) {
  render(
    <MemoryRouter>
      <NavBar user={user} />
    </MemoryRouter>,
  );
}

describe("when user is not signed in", () => {
  test("Log In button is visible", async () => {
    await renderComponent();

    const logInButton = screen.getByRole("button", { name: /log in/i });

    expect(logInButton).toBeInTheDocument();
  });
});

describe("when user is signed in", () => {
  // Here you can add additional handlers specific to this test suite
  const testUser = {
    _id: "654211f0b18669b0f1ab2055",
    name: "Test",
    email: "test@test",
    role: "user",
    iat: 1721618651,
    exp: 1721705051,
  };

  test("User's name  is visible", async () => {
    await renderComponent(testUser);

    screen.debug();

    const userLabel = screen.getByRole("button", { name: /test/i });

    expect(userLabel).toBeInTheDocument();
  });
});
