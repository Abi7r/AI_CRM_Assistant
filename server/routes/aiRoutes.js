const express = require("express");
const aiController = require("../controllers/aiController");
const router = express.Router();

router.post("/query", aiController.queryWithAi);
router.get("/simple", aiController.simpleQuery);

module.exports = router;
