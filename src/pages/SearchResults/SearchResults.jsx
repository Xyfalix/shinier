import NavBar from "../../components/NavBar";
import { getUser, fetchCards } from "../../utilities/users-service";
import { useState, useEffect } from "react";
import Card from "../../components/Card";

export default function SearchResults({ firstSearch, updateCardsDetails }) {
  const [user, setUser] = useState(getUser);
  const [searchTerm, setSearchTerm] = useState(firstSearch);
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const cardsPerPage = 12;

  function handleSearch(submittedSearch) {
    setSearchTerm(submittedSearch)
  }


  useEffect(() => {

    async function displayCards() {
      if (searchTerm) {
        try {
          setLoading(true);
          const cardsData = await fetchCards(searchTerm);
          console.log(cardsData)
          setCards(cardsData);
          // state lift cardDetails state in App.jsx to pass down as prop to CardDetails component
          updateCardsDetails(cardsData);
          setLoading(false);
          
        } catch (error) {
          console.error("Card search failed", error);
        }
      }
    }

    displayCards();

  }, [searchTerm])

  // Calculate the indexes for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // create shallow copies for each page
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
  const nPages = Math.ceil(cards.length/cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <NavBar user={user} setUser={setUser} handleSearch={handleSearch} />
      <div className="w-80 bg-slate-800 m-5 p-3 border-white border-2">
        <h2 className="text-white text-3xl">{cards.length} Products Found</h2>
      </div>
      {/* Loading indicator */}
      {loading && (
        <div className="loading-container flex flex-row mx-5">
          <p className="text-white text-lg mr-2">Loading your search results</p>
          <span className="loading loading-dots loading-md"></span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5">
        {currentCards.map((card) => (
          <Card
            key={card.id}
            cardId={card.id}
            cardName={card.name}
            cardImage={card.images.small}
            setName={card.set.name}
            setNumber={card.number}
            setTotal={card.set.total}
            rarity={card.rarity}
            price={
              card.tcgplayer?.prices?.holofoil?.market !== undefined
                ? `${card.tcgplayer.prices.holofoil.market}`
                : "Out of Stock"
            }
          />
        ))}
      </div>
      <div className="join flex justify-center">
        {cards.length > 0 && <button className="join-item btn" onClick={goToPrevPage}>
          «
        </button>}
        {Array.from(
          // set number of pages
          { length: nPages },
          (_, index) => (
            <button
              key={index}
              className={`btn ${currentPage === index + 1 ? "btn-active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
        {cards.length > 0 && <button className="join-item btn" onClick={goToNextPage}>
          »
        </button>}
      </div>

      {/* <div className="join flex justify-center">
        <button className="join-item btn" onClick={goToPrevPage}>«</button>
        <button className="join-item btn">{currentPage}</button>
        <button className="join-item btn" onClick={goToNextPage}>»</button>
      </div> */}
    </>
  );
}
