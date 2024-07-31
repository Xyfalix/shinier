import { render, screen, act } from "@testing-library/react";
import ShoppingCart from "./ShoppingCart";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
// import { getCart } from "../../utilities/users-service";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

jest.mock("../../components/NavBar", () => {
  const mockNavBar = () => <div>Mocked NavBar</div>;
  mockNavBar.displayName = "MockNavBar";
  return mockNavBar;
});

// jest.mock("../../components/CartCard", () => {
//   const mockOrderItem = ({ name }) => <div>{name}</div>;
//   mockOrderItem.displayName = "MockCard";
//   return mockOrderItem;
// });

// jest.mock("../../utilities/users-service", () => ({
//   getCart: jest.fn(),
//   setItemQty: jest.fn(),
//   deleteItemFromCart: jest.fn(),
// }));

const originalMockCartData = {
  cartWithExtPrice: [
    {
      _id: "1",
      item: {
        itemName: "Sample Item 1",
        itemId: "001",
        itemPrice: 10.99,
        itemRarity: "Common",
        itemImage: "sample-image1.jpg",
        setName: "Set A",
        setNumber: 1,
        setTotal: 100,
      },
      qty: 2,
      extPrice: 21.98, // qty * itemPrice
    },
    {
      _id: "2",
      item: {
        itemName: "Sample Item 2",
        itemId: "002",
        itemPrice: 15.49,
        itemRarity: "Uncommon",
        itemImage: "sample-image2.jpg",
        setName: "Set B",
        setNumber: 2,
        setTotal: 50,
      },
      qty: 1,
      extPrice: 15.49, // qty * itemPrice
    },
    {
      _id: "3",
      item: {
        itemName: "Sample Item 3",
        itemId: "003",
        itemPrice: 25.0,
        itemRarity: "Rare",
        itemImage: "sample-image3.jpg",
        setName: "Set C",
        setNumber: 3,
        setTotal: 75,
      },
      qty: 3,
      extPrice: 75.0, // qty * itemPrice
    },
  ],
  totalQty: 6,
  orderTotal: 112.47,
};

const updatedMockCartData = {
  cartWithExtPrice: [
    {
      _id: "1",
      item: {
        itemName: "Sample Item 1",
        itemId: "001",
        itemPrice: 10.99,
        itemRarity: "Common",
        itemImage: "sample-image1.jpg",
        setName: "Set A",
        setNumber: 1,
        setTotal: 100,
      },
      qty: 4,
      extPrice: 43.96, // qty * itemPrice
    },
    {
      _id: "2",
      item: {
        itemName: "Sample Item 2",
        itemId: "002",
        itemPrice: 15.49,
        itemRarity: "Uncommon",
        itemImage: "sample-image2.jpg",
        setName: "Set B",
        setNumber: 2,
        setTotal: 50,
      },
      qty: 1,
      extPrice: 15.49, // qty * itemPrice
    },
    {
      _id: "3",
      item: {
        itemName: "Sample Item 3",
        itemId: "003",
        itemPrice: 25.0,
        itemRarity: "Rare",
        itemImage: "sample-image3.jpg",
        setName: "Set C",
        setNumber: 3,
        setTotal: 75,
      },
      qty: 3,
      extPrice: 75.0, // qty * itemPrice
    },
  ],
  totalQty: 8,
  orderTotal: 134.45,
};

const deletedMockCartData = {
  cartWithExtPrice: [
    {
      _id: "1",
      item: {
        itemName: "Sample Item 1",
        itemId: "001",
        itemPrice: 10.99,
        itemRarity: "Common",
        itemImage: "sample-image1.jpg",
        setName: "Set A",
        setNumber: 1,
        setTotal: 100,
      },
      qty: 2,
      extPrice: 21.98, // qty * itemPrice
    },
    {
      _id: "2",
      item: {
        itemName: "Sample Item 2",
        itemId: "002",
        itemPrice: 15.49,
        itemRarity: "Uncommon",
        itemImage: "sample-image2.jpg",
        setName: "Set B",
        setNumber: 2,
        setTotal: 50,
      },
      qty: 1,
      extPrice: 15.49, // qty * itemPrice
    },
  ],
  totalQty: 3,
  orderTotal: 37.47,
};

let currentMockCartData = originalMockCartData;

const mockUpdateFirstSearch = jest.fn();

const handlers = [
  http.get("/api/orders/getCart", () => {
    console.log('captured a "GET /api/orders/getCart" request');
    return HttpResponse.json(currentMockCartData);
  }),
  http.patch("/api/orders/setItemQty/:itemId/:itemQty", ({ params }) => {
    console.log(
      `captured a "PATCH /api/orders/${params.itemId}/${params.itemQty}" request`,
    );
    currentMockCartData = updatedMockCartData;
    return HttpResponse.json({ success: true });
  }),
  http.delete("/api/orders/:itemId", ({ params }) => {
    console.log(`captured a "DELETE /api/orders/${params.itemId}" request`);
    currentMockCartData = deletedMockCartData;
    return HttpResponse.json({ success: true });
  }),
];

const server = setupServer(...handlers);

// runs the code inside one time before all the tests in the file
beforeAll(() => {
  HTMLDialogElement.prototype.show = jest.fn(function mock() {
    this.open = true;
  });

  HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function mock() {
    this.open = false;
  });
  HTMLFormElement.prototype.requestSubmit = jest.fn();
  server.listen();
});

// runs the code inside one time after each test completes
afterEach(() => {
  currentMockCartData = originalMockCartData;
  server.resetHandlers();
});

// runs the code inside one time after all tests have completed
afterAll(() => {
  server.close();
});

async function renderComponent() {
  await act(async () => {
    render(
      <MemoryRouter>
        <ShoppingCart updateFirstSearch={mockUpdateFirstSearch} />
      </MemoryRouter>,
    );
  });
}

describe("check order displays", () => {
  test("Check that 3 order items are displayed", async () => {
    await renderComponent();

    const orders = await screen.findAllByText(/Sample Item \d+/);

    expect(orders).toHaveLength(3);
  });

  test("Check that changing quantity of cart items updates total quantity and total price", async () => {
    await renderComponent();

    // selecting drop down from first card
    const quantitySelect = screen.getAllByRole("combobox")[0];

    const totalSumElement = screen.getByTestId("total-sum");
    const totalQtyElement = screen.getByTestId("total-qty");

    await userEvent.selectOptions(quantitySelect, "4");

    expect(quantitySelect).toHaveValue("4");
    expect(totalSumElement).toHaveTextContent("Total: $134.45");
    expect(totalQtyElement).toHaveTextContent("8 Total Item(s)");
  });

  test("Check that deleting an item from cart updates the cart to have 2 display items", async () => {
    await renderComponent();
    const deleteButtons = screen.getAllByRole("button", { name: "🗑️" });
    await userEvent.click(deleteButtons[2]);

    // Wait for the modal to appear
    // await waitFor(() => screen.getByRole('dialog', { name: /delete item/i }));

    const deleteConfirmButton = await screen.findByRole("button", {
      name: /delete/i,
    });
    await userEvent.click(deleteConfirmButton);

    const orders = await screen.findAllByText(/Sample Item \d+/);

    expect(orders).toHaveLength(2);
  });
});
