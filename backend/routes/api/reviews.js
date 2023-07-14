const express = require("express");
const { requireAuth } = require("../../utils/auth");

const {
  Spot,
  User,
  Review,
  SpotImage,
  ReviewImage,
} = require("../../db/models");

const { Sequelize } = require("sequelize");

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const allReviews = await Review.findAll({
    where: { userId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        as: "Spot",
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          [
            Sequelize.literal(
              `(SELECT url FROM SpotImages WHERE SpotImages.spotId = Spot.id AND SpotImages.preview = true LIMIT 1)`
            ),
            "previewImage",
          ],
        ],
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  const response = {
    Reviews: allReviews,
  };

  res.json(response);
});

module.exports = router;
