import { rest } from "msw";

const mockCartData = {
  cartWithExtPrice: [
    {
      _id: "1",
      item: {
        itemName: "Sample Item 1",
        itemId: "001",
        itemPrice: 10.99,
        itemRarity: "Common",
        itemImage: "sample-image1.jpg",
        setName: "Set A",
        setNumber: 1,
        setTotal: 100,
      },
      qty: 2,
      extPrice: 21.98, // qty * itemPrice
    },
    {
      _id: "2",
      item: {
        itemName: "Sample Item 2",
        itemId: "002",
        itemPrice: 15.49,
        itemRarity: "Uncommon",
        itemImage: "sample-image2.jpg",
        setName: "Set B",
        setNumber: 2,
        setTotal: 50,
      },
      qty: 1,
      extPrice: 15.49, // qty * itemPrice
    },
    {
      _id: "3",
      item: {
        itemName: "Sample Item 3",
        itemId: "003",
        itemPrice: 25.0,
        itemRarity: "Rare",
        itemImage: "sample-image3.jpg",
        setName: "Set C",
        setNumber: 3,
        setTotal: 75,
      },
      qty: 3,
      extPrice: 75.0, // qty * itemPrice
    },
  ],
  totalQty: 6,
  orderTotal: 112.47,
};

export const handlers = [
  rest.get("/api/orders/getCart", (req, res, ctx) => {
    console.log('captured a "GET /api/orders/getCart" request');
    return res(ctx.json(mockCartData));
  }),

  rest.delete("/api/orders/:itemId", ({ params }) => {
    console.log(`captured a "DELETE /api/orders/${params.itemId}" request`);
  }),
];
