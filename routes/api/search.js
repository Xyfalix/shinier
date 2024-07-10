const express = require("express");
const router = express.Router();
const searchCtrl = require("../../controllers/api/search");

router.get("/search/:searchTerm", searchCtrl.fetchCards);

module.exports = router;
