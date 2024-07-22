import { logout } from "../utilities/users-service";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import SearchInput from "./SearchInput";

export default function NavBar({ user, setUser, handleSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate("/")
  };

  const handleLogin = () => {
    navigate("/login")
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    setUser(null);
  };

  const handleNavigateToOrders = () => {
    navigate("/orders");
  }

  const isAdmin = user && user.role === "admin";

  return (
    <nav className="bg-indigo-700 text-primary-content py-2">
      {user ? ( // user is signed in
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <button onClick={handleHome} className="btn btn-ghost normal-case text-2xl">Shinier</button>
            <p className="text-lg mx-4">Pokemon</p>
            {location.pathname !== "/" && <SearchInput isInNavBar={true} handleSearch={handleSearch} />} {/* Conditionally render SearchInput */}
          </div>
          <div className="flex flex-row items-center">
            <Link to="/shoppingCart">
              <p className="mx-2 mb-1 text-xl"><BsFillCartPlusFill /></p>
            </Link>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost rounded-btn">
                👤 {user.name}
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-indigo-700 rounded-box w-32 mt-2 items-start"
              >
                <li>
                  <button onClick={handleNavigateToOrders}>My Orders</button>
                </li>
                {isAdmin && ( // Render viewItems link if user is an admin
                  <li>
                    <Link to="/viewItems">View Stock</Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // user === null
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <a className="btn btn-ghost normal-case text-2xl">Shinier</a>
            <p className="text-lg mx-4">Pokemon</p>
            {location.pathname !== "/" && <SearchInput isInNavBar={true} handleSearch={handleSearch} />} {/* Conditionally render SearchInput */}
          </div>
          <div className="flex flex-row items-center">
            <button className="btn btn-ghost normal-case text-lg" onClick={handleLogin}>👤 Log In</button>
          </div>
        </div>
      )}
    </nav>
  );
}