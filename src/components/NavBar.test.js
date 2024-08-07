import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

async function renderComponent(user, children) {
  render(
    <MemoryRouter>
      <NavBar user={user} />
      {children}
    </MemoryRouter>,
  );
}

describe("when user is not signed in", () => {
  test("Log In button is visible", async () => {
    await renderComponent();

    const logInButton = screen.getByRole("button", { name: /log in/i });

    expect(logInButton).toBeInTheDocument();
  });

  test("redirects to login page when Log In button is clicked", async () => {
    const user = userEvent.setup();

    await renderComponent(
      null,
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
    );

    const logInButton = screen.getByRole("button", { name: /log in/i });
    await user.click(logInButton);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
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

    const userButton = screen.getByRole("button", { name: /test/i });

    expect(userButton).toBeInTheDocument();
  });

  test("Clicking on the shopping cart when user is logged in redirects user to the shopping cart page", async () => {
    const user = userEvent.setup();

    await renderComponent(
      testUser,
      <Routes>
        <Route path="/shoppingCart" element={<div>Shopping Cart</div>} />
      </Routes>,
    );

    const shoppingCartButton = screen.getByTestId("shopping-cart-button");
    await user.click(shoppingCartButton);

    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
  });
});
