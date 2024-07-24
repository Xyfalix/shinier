import { render, screen, act } from "@testing-library/react";
import ShoppingCart from "./ShoppingCart";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { getCart } from "../../utilities/users-service";

jest.mock("../../components/NavBar", () => {
  const mockNavBar = () => <div>Mocked NavBar</div>;
  mockNavBar.displayName = "MockNavBar";
  return mockNavBar;
});

jest.mock("../../components/CartCard", () => {
  const mockOrderItem = ({ name }) => <div>{name}</div>;
  mockOrderItem.displayName = "MockCard";
  return mockOrderItem;
});

jest.mock("../../utilities/users-service", () => ({
  getCart: jest.fn(),
}));

const mockCartData = {
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
};

const mockUpdateFirstSearch = jest.fn();

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
  beforeEach(() => {
    getCart.mockResolvedValue(mockCartData);
  });

  test("Check that 3 order items are displayed", async () => {
    await renderComponent();

    screen.debug;

    const orders = await screen.findAllByText(/Sample Item \d+/);

    expect(orders).toHaveLength(3);
  });
});
