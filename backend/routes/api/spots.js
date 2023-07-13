const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Spot, User, Review, SpotImage } = require("../../db/models");
const { Sequelize } = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
    order: [["id"]],
    include: [
      {
        model: Review,
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
        ],
      },
      {
        model: SpotImage,
        where: { preview: true },
        attributes: ["url"],
      },
    ],
    group: ["Spot.id"],
  });

  const formattedSpots = allSpots.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.Reviews[0]?.dataValues.avgRating,
    previewImage: spot.SpotImages[0]?.url,
  }));

  res.json(formattedSpots);
});

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const allSpots = await Spot.findAll({
    where: { ownerId: userId },
    order: [["id"]],
    include: [
      {
        model: Review,
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
        ],
      },
      {
        model: SpotImage,
        where: { preview: true },
        attributes: ["url"],
      },
    ],
    group: ["Spot.id"],
  });

  const formattedSpots = allSpots.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.Reviews[0]?.dataValues.avgRating,
    previewImage: spot.SpotImages[0]?.url,
  }));

  res.json(formattedSpots);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const spot = await Spot.findByPk(id, {
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        as: "Reviews",
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM `Reviews` WHERE `Reviews`.`spotId` = `Spot`.`id`)"
          ),
          "numReviews",
        ],
        [
          Sequelize.literal(
            "(SELECT AVG(`stars`) FROM `Reviews` WHERE `Reviews`.`spotId` = `Spot`.`id`)"
          ),
          "avgStarRating",
        ],
      ],
    },
    group: ["Spot.id", "SpotImages.id", "Owner.id", "Reviews.id"],
  });
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  res.json(spot);
});

module.exports = router;
