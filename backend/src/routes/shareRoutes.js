const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Get shares" });
});

router.post("/", (req, res) => {
  res.json({ message: "Buy shares" });
});

module.exports = router;