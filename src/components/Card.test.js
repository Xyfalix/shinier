import { render, screen } from "@testing-library/react";
import Card from "./Card";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const mockCardData = {
  cardId: "002",
  cardName: "Test Card 2",
  cardImage: "https://example.com/test-card-2.jpg",
  setName: "Test Set",
  setNumber: "002",
  setTotal: "100",
  rarity: "Rare",
  price: "Out of Stock",
};

function renderComponent() {
  render(
    <MemoryRouter>
      <Card
        cardId={mockCardData.cardId}
        cardName={mockCardData.cardName}
        cardImage={mockCardData.cardImage}
        setName={mockCardData.setName}
        setNumber={mockCardData.setNumber}
        setTotal={mockCardData.setTotal}
        rarity={mockCardData.rarity}
        price={mockCardData.price}
      />
    </MemoryRouter>,
  );
}

describe("Check card rendering details", () => {
  test("Check that card image renders", async () => {
    renderComponent();

    const cardImage = screen.getByAltText(mockCardData.cardName);

    expect(cardImage).toBeInTheDocument();

    expect(cardImage).toHaveAttribute("src", mockCardData.cardImage);
  });

  test("Check that user is unable to click on add to cart button when card is out of stock", async () => {
    renderComponent();

    const addCartBtn = screen.getByTestId("add-to-cart-button");

    expect(addCartBtn).toBeDisabled();
  });
});
