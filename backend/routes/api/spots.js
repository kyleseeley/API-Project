const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Spot, User } = require("../../db/models");

const router = express.Router();

router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
    order: [["id"]],
  });
  res.json(allSpots);
});

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const currentUserSpots = await Spot.findAll({
    where: { ownerId: userId },
    order: [["id"]],
  });
  res.json(currentUserSpots);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const spot = await Spot.findByPk(id, {
    include: [
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      {
        model: Review,
        as: "Reviews",
        attributes: [],
      },
    ],
    attributes: {
      include: [
        "numReviews",
        [
          Spot.sequelize.literal('COALESCE(AVG("Reviews"."rating"), 0)'),
          "avgStarRating",
        ],
      ],
      exclude: ["createdAt", "updatedAt"],
    },
    group: [
      "Spot.id",
      "Owner.id",
      "Owner->SpotImages.id",
      "Reviews.id",
      "SpotImages.id",
    ],
  });
  if (!spot) {
    const error = new Error(`Spot not found with id: ${spotId}`);
    error.status = 404;
    throw error;
  }
  res.json(spot);
});

module.exports = router;
