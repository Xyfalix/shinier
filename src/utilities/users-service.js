// Import all named exports attached to a usersAPI object
// This syntax can be helpful documenting where the methods come from
import * as usersAPI from "./users-api";

export async function signUp(userData) {
  // Delegate the network request code to the users-api.js API module
  // which will ultimately return a JSON Web Token (JWT)
  const token = await usersAPI.signUp(userData);
  // Baby step by returning whatever is sent back by the server
  return token;
}

function getTokenPayload(token) {
  const tokenArray = token.split(".");
  const middle = tokenArray[1];
  // decode base 64-encoded token
  const payload = window.atob(middle);
  return payload;
}

export function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const payload = getTokenPayload(token);

  if (payload.exp < Date.now() / 1000) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
}

export function getUser() {
  const token = getToken();
  if (token === null) {
    return null;
  }

  const payload = getTokenPayload(token);
  return JSON.parse(payload);
}

export function logout() {
  localStorage.removeItem("token");
}

// calls the login function from users-api
export async function login(email, password) {
  const data = await usersAPI.login(email, password);
  return data;
}

export async function checkToken() {
  const data = await usersAPI.checkToken();
  return data;
}

export async function getAllOrders() {
  // return all orders if they exist or a message saying no available order history
  const ordersData = await usersAPI.getAllOrders();
  return ordersData;
}

export async function getCart() {
  // return cart object if it exists or a message saying cart is empty
  const cartData = await usersAPI.getCart();
  return cartData;
}

export async function setItemQty(itemId, itemQty) {
  // return item object with updated qty
  const updatedItem = await usersAPI.setItemQty(itemId, itemQty);
  return updatedItem;
}

export async function addToCart(itemId, qtyAdded, cardDetails) {
  // returns cart with new added item
  console.log(`usersServices ${cardDetails}`);
  const updatedCartData = await usersAPI.addToCart(
    itemId,
    qtyAdded,
    cardDetails,
  );
  return updatedCartData;
}

export async function deleteItemFromCart(itemId) {
  // returns remaining cart items after deletion
  const updatedCartData = await usersAPI.deleteItemFromCart(itemId);
  return updatedCartData;
}

export async function checkout() {
  // returns entire cart with order status changed to paid
  console.log("checkout function called");
  const updatedCartData = await usersAPI.checkout();
  return updatedCartData.orderStatus;
}

// retrieve all items in Db
export async function getAllItems() {
  // return all items if they exist or a message saying no items in db
  const itemsData = await usersAPI.getAllItems();
  return itemsData;
}

// add item to Db
export async function addItem(item) {
  // returns new item Json
  const newItemData = await usersAPI.addItem(item);
  return newItemData;
}

// search for cards
export async function fetchCards(searchTerm) {
  const cardData = await usersAPI.fetchCards(searchTerm);
  return cardData;
}
