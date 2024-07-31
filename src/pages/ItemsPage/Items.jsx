import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import { getAllItems } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utilities/users-service";

export default function Items({ updateFirstSearch }) {
  const [user, setUser] = useState(getUser);
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  function handleSearch(searchInput) {
    updateFirstSearch(searchInput);
    navigate(`/search?q=${searchInput}`);
  }

  const getItems = async () => {
    try {
      const cardItems = await getAllItems();
      console.log(cardItems);
      setItems(cardItems);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  async function handleAddItem() {
    navigate("/addItems");
  }

  return (
    <>
      <NavBar user={user} setUser={setUser} handleSearch={handleSearch} />
      <div className="flex flex-row justify-between">
        <p className="text-3xl text-white m-5">Card Quantity List</p>
        <button onClick={handleAddItem} className="m-5 btn btn-md bg-slate-600 text-white">Add Item</button>
      </div>
      <div className="overflow-x-auto flex flex-row justify-center">
        <table className="table text-center border-white border text-white mt-3 mx-2 max-w-fit">
          {/* head */}
          <thead>
            <tr className="border-white border text-base text-white">
              <th>Card Id</th>
              <th>Card Name</th>
              <th>Set Name</th>
              <th>Rarity</th>
              <th>Available Stock</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr className="hover border-white border" key={item._id}>
                <td>{item.itemId}</td>
                <td>{item.itemName}</td>
                <td>{item.setName}</td>
                <td>{item.itemRarity}</td>
                <td>{item.availableStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
