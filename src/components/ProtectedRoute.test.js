import { render, screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import "@testing-library/jest-dom";

const MockOrders = () => <div>Orders Page</div>;
const MockAccessDenied = () => <div>Access Denied</div>;
const MockLogin = () => <div>Log In</div>;

async function renderComponent(user, requiredRole) {
  render(
    <MemoryRouter initialEntries={["/orders"]}>
      <Routes>
        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user} requiredRole={requiredRole}>
              <MockOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/access-denied" element={<MockAccessDenied />} />
        <Route path="/login" element={<MockLogin />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("check that Protected Route works correctly", () => {
  test("redirects to /login if user is not signed in", async () => {
    const nullUser = null;
    await renderComponent(nullUser);

    const loginPage = screen.getByText("Log In");

    expect(loginPage).toBeInTheDocument();
  });

  test("renders Orders Page if user is authenticated and has admin role", async () => {
    const testUser = {
      name: "test",
      email: "test@test",
      password: "123456",
      role: "admin",
    };
    await renderComponent(testUser);

    const ordersPage = await screen.findByText("Orders Page");

    expect(ordersPage).toBeInTheDocument();
  });

  test("renders Access Denied page if user is authenticated but does not have admin role", async () => {
    const testUser = {
      name: "test",
      email: "test@test",
      password: "123456",
      role: "user",
    };

    const requiredRole = "admin";

    await renderComponent(testUser, requiredRole);

    const accessDeniedPage = await screen.findByText("Access Denied");

    expect(accessDeniedPage).toBeInTheDocument();
  });
});
