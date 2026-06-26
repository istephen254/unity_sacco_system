const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Get assets" });
});

module.exports = router;