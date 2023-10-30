const express = require("express");
const router = express.Router();
const ordersCtrl = require("../../controllers/api/orders");
const { checkToken } = require("../../config/checkToken");

router.get("/", checkToken, ordersCtrl.getAllOrders);
router.get("/getCart", checkToken, ordersCtrl.getCart);
router.patch("/setItemQty", checkToken, ordersCtrl.setItemQtyInCart);
router.post("/:itemId", checkToken, ordersCtrl.addToCart);
router.delete("/:itemId", checkToken, ordersCtrl.deleteItemFromOrder);
router.patch("/checkout", checkToken, ordersCtrl.checkout);

module.exports = router;