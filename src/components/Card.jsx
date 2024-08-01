import { Link } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import { addToCart } from "../utilities/users-service";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Card({
  cardId,
  cardName,
  cardImage,
  setName,
  setNumber,
  setTotal,
  rarity,
  price,
}) {
  const [qtyAdded, setQtyAdded] = useState(1);
  const MySwal = withReactContent(Swal)

  const handleDropdownChange = (e) => {
    setQtyAdded(e.target.value); // Convert the value to an integer
  };

  async function handleAddToCart() {
    const cardDetails = {
      itemName: cardName,
      itemPrice: price,
      itemRarity: rarity,
      itemImage: cardImage,
      setName: setName,
      setNumber: setNumber,
      setTotal: parseInt(setTotal),
    };

    try {
      console.log(cardDetails);
      await addToCart(cardId, qtyAdded, cardDetails);
      MySwal.fire({
        title: <p>Item added to cart!</p>,
        icon: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      MySwal.fire({
        title: <p>Failed to add item to cart</p>,
        icon: "error",
      });
    }
  }

  return (
    <>
      <div className="w-72 bg-slate-800 flex flex-col items-start border-white border-2">
        <Link to={`/cardDetails/${cardId}`}>
          <figure className="flex flex-row w-full mx-4 my-3">
            <img src={cardImage} alt={cardName} />
          </figure>
        </Link>
        <hr className="w-full bg-white my-3" />
        <div className="flex flex-col pl-7 items-start w-full">
          <p className="text-white">
            {cardName} - {setNumber}/{setTotal}
          </p>
          <p className="text-white">{rarity}</p>
          <p className="text-white">{setName}</p>
          <div className="flex flex-row justify-between items-center w-full ">
            <p className={`text-green-500 my-5 ${price === "Out of Stock" ? "text-red-500" : ""}`}>
              {price !== "Out of Stock" ? `$${price}` : price}
            </p>
            <select
              className="select outline outline-2 outline-black select-xs bg-white rounded-md my-2 text-black"
              defaultValue="1"
              onChange={handleDropdownChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button
              onClick={handleAddToCart}
              className="btn btn-sm bg-indigo-700 mr-7"
              data-testid="add-to-cart-button"
              disabled={price === "Out of Stock"}
            >
              <BsFillCartPlusFill />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
