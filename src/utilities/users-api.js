// This is the base path of the Express route we'll define
const BASE_URL = "/api/users";
const ORDERS_URL = "/api/orders";
const ITEMS_URL = "/api/items";
const SEARCH_URL = "/api/search";

export async function signUp(userData) {
  // Fetch uses an options object as a second arg to make requests
  // other than basic GET requests, include data, headers, etc.
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Fetch requires data payloads to be stringified
    // and assigned to a body property on the options object
    body: JSON.stringify(userData),
  });
  // Check if request was successful
  if (res.ok) {
    // res.json() will resolve to the JWT
    return res.json();
  } else {
    throw new Error("Invalid Sign Up");
  }
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Fetch requires data payloads to be stringified
    // and assigned to a body property on the options object
    body: JSON.stringify({ email, password }),
  });

  // Check if request was successful
  if (res.ok) {
    // res.json() will resolve to the JWT
    return res.json();
  } else {
    throw new Error("Invalid username/password");
  }
}

export async function checkToken() {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch("/api/users/check-token", { headers });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error checking token: " + error.message);
  }
}

export async function getAllOrders() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${ORDERS_URL}`, { headers });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // return all orders if they exist or a message saying no available order history
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error accessing orders");
  }
}

export async function getCart() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${ORDERS_URL}/getCart`, { headers });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // return cart object if it exists or a message saying cart is empty
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error accessing cart");
  }
}

export async function setItemQty(itemId, itemQty) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${ORDERS_URL}/setItemQty/${itemId}/${itemQty}`,
      {
        method: "PATCH",
        headers,
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // return item object with updated qty
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error changing item qty");
  }
}

export async function addToCart(itemId, qtyAdded, cardDetails) {
  console.log(`usersApi ${JSON.stringify(cardDetails)}`);
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${ORDERS_URL}/${itemId}/${qtyAdded}`, {
      method: "POST",
      headers,
      body: JSON.stringify(cardDetails),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // returns cart with new added item
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error adding item to cart");
  }
}

export async function deleteItemFromCart(itemId) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${ORDERS_URL}/${itemId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // returns remaining cart items after deletion
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error deleting item from cart");
  }
}

export async function checkout() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${ORDERS_URL}/checkout`, {
      method: "PATCH",
      headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // returns entire cart with order status changed to paid
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error checking out cart");
  }
}

export async function getAllItems() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${ITEMS_URL}`, { headers });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // return all items if they exist or a message saying no items in db
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error accessing items");
  }
}

export async function addItem(item) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${ITEMS_URL}`, {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // returns new item Json
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error adding item to database");
  }
}

export async function fetchCards(searchTerm) {
  try {
    const response = await fetch(`${SEARCH_URL}/${searchTerm}`);

    if (!response.ok) {
      throw new Error("Pokemon card search request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching cards: ${error.message}`);
  }
}
