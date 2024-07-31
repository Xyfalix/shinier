import NavBar from "../../components/NavBar";
import CartCard from "../../components/CartCard";
import { getUser, getCart } from "../../utilities/users-service";
import { checkout } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function ShoppingCart({ updateFirstSearch }) {
  const [user, setUser] = useState(getUser);
  const [cartData, setCartData] = useState(null);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal)

  function handleSearch(searchInput) {
    updateFirstSearch(searchInput);
    navigate(`/search?q=${searchInput}`);
  }

  // run getCart to display current items in shoppingCart and update
  const fetchCart = async () => {
    try {
      const cart = await getCart();
      setCartData(cart);
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // rerun getCart when qty is changed for any card item in cart
  const handleQuantityUpdate = async () => {
    await fetchCart();
  };

  const showModal = () => {
    const modal = document.getElementById("checkout-modal");
    modal.showModal();
  };

  const hideModal = () => {
    const modal = document.getElementById("checkout-modal");
    modal.close();
  };

  const handleCheckout = async () => {
    showModal();
  };

  const confirmCheckout = async () => {
    try {
      await checkout();
      await fetchCart();
      hideModal();
      MySwal.fire({
        title: <p>Order successfully checked out!</p>,
        icon: "success",
      });
    } catch (error) {
      console.error("Error occurred when trying to check out: ", error);
      MySwal.fire({
        title: <p>Failed to checkout order</p>,
        icon: "error",
      });
    }
  };

  return (
    <>
      <NavBar user={user} setUser={setUser} handleSearch={handleSearch} />
      <div className="flex flex-row min-w-max">
        <div className="shopping-cart-container w-7/12">
          <p className="text-3xl text-white mx-2 my-5">Shopping Cart</p>
          <div className="flex flex-row w-96 bg-slate-800 mx-2 my-5 p-3 justify-between items-center border-2 border-white">
            <p className="mx-2 text-white text-xl" data-testid="total-qty">
              {cartData?.totalQty || 0} Total Item(s)
            </p>
            <button
              className="btn btn-md bg-indigo-700 text-white"
              onClick={() => navigate(`/search`)} // Navigate to the shopping page
            >
              Continue Shopping
            </button>
          </div>
          {cartData?.cartWithExtPrice?.length > 0 ? (
            // Cart is not empty
            cartData.cartWithExtPrice.map((cartItem) => (
              <CartCard
                key={cartItem._id}
                name={cartItem.item.itemName}
                cardId={cartItem.item.itemId}
                qty={cartItem.qty}
                price={cartItem.item.itemPrice}
                rarity={cartItem.item.itemRarity}
                image={cartItem.item.itemImage}
                setName={cartItem.item.setName}
                setNum={cartItem.item.setNumber}
                setTotal={cartItem.item.setTotal}
                extPrice={cartItem.extPrice}
                handleQuantityUpdate={handleQuantityUpdate}
              />
            ))
          ) : (
            // Cart is empty
            <div className="text-center mr-32">
              <p>Your cart is empty 😔</p>
            </div>
          )}
        </div>
        {/* Render the summary container only if the cart is not empty */}
        {cartData?.cartWithExtPrice?.length > 0 && (
          <div className="summary-container w-max h-max mt-44 ml-8 border-white border-2">
            <div className="bg-slate-800 flex flex-col items-center">
              <p className="mx-10 mt-2 text-white text-3xl" data-testid="total-sum">
                Total:{" "}
                {typeof cartData?.orderTotal === "number"
                  ? `$${cartData.orderTotal.toFixed(2)}`
                  : ""}
              </p>
              <button
                className="btn btn-lg bg-indigo-700 text-white mt-5 ml-2 mb-5 mr-5"
                onClick={handleCheckout}
              >
                CheckOut
              </button>
            </div>
          </div>
        )}
      </div>
      <dialog id="checkout-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Checkout</h3>
          <p className="py-4">Are you sure you want to checkout your cart?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-indigo-700 " onClick={confirmCheckout}>
                Checkout
              </button>
              <button className="btn ml-5" onClick={hideModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
