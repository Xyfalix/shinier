import { render, screen, act } from "@testing-library/react";
import SearchResults from "./SearchResults";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { fetchCards } from "../../utilities/users-service";
import userEvent from "@testing-library/user-event";

jest.mock("../../components/NavBar", () => {
  const MockNavBar = () => <div>Mocked NavBar</div>;
  MockNavBar.displayName = "MockNavBar";
  return MockNavBar;
});

jest.mock("../../components/Card", () => {
  const MockCard = ({ cardName }) => <div>{cardName}</div>;
  MockCard.displayName = "MockCard";
  return MockCard;
});

jest.mock("../../utilities/users-service", () => ({
  fetchCards: jest.fn(),
}));

const mockCardData = Array.from({ length: 23 }, (_, index) => ({
  id: `card${index + 1}`,
  name: `Card ${index + 1}`,
  images: { small: `image${index + 1}.jpg` },
  set: { name: `Set ${index + 1}`, total: 24 },
  number: index + 1,
  rarity: "Rare",
  tcgplayer: { prices: { holofoil: { market: index + 1.0 } } },
}));

const mockUpdateCardDetails = jest.fn();

async function renderComponent() {
  await act(async () => {
    render(
      <MemoryRouter>
        <SearchResults
          firstSearch="test"
          updateCardsDetails={mockUpdateCardDetails}
        />
      </MemoryRouter>,
    );
  });
}

describe("Check card displays", () => {
  beforeEach(() => {
    fetchCards.mockResolvedValue(mockCardData);
  });

  test("Check that 12 cards are displayed on page 1, 11 cards on page 2", async () => {
    const user = userEvent.setup();

    await renderComponent();

    // await waitFor(() => expect(fetchCards).toHaveBeenCalledWith("test"));

    const firstPageCards = await screen.findAllByText(/Card \d+/);

    expect(firstPageCards).toHaveLength(12);

    const nextPageButton = screen.getByRole("button", { name: "2" });
    await user.click(nextPageButton);

    const secondPageCards = await screen.findAllByText(/Card \d+/);

    expect(secondPageCards).toHaveLength(11);
  });
});
