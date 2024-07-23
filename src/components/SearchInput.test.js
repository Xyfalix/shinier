import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

async function renderComponent(handleSearch) {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <SearchInput isInNavBar={true} handleSearch={handleSearch} />
    </MemoryRouter>,
  );
}

describe("Search functionality check", () => {
  test("Clicking on the search button will redirect to the search link with the specified query", async () => {
    const user = userEvent.setup();
    const mockHandleSearch = jest.fn();
    const searchTerm = "charizard";

    await renderComponent(mockHandleSearch);

    const input = screen.getByPlaceholderText("Search for cards, box sets..");
    await user.type(input, searchTerm);

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(mockHandleSearch).toHaveBeenCalledWith(searchTerm);
    expect(mockedUseNavigate).toHaveBeenCalledWith(`/search?q=${searchTerm}`);
  });
});
