const express = require("express");

const { Spot } = require("../../db/models");

const router = express.Router();

router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
    order: [["id"]],
  });
  res.json(allSpots);
});

module.exports = router;
