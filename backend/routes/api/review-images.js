const express = require("express");
const { requireAuth } = require("../../utils/auth");

const {
  Spot,
  User,
  Review,
  SpotImage,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { Op } = require("sequelize");

const { Sequelize } = require("sequelize");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  try {
    // Check if the image exists
    const image = await ReviewImage.findByPk(imageId);
    if (!image) {
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });
    }

    // Check if the review belongs to the current user
    const review = await Review.findByPk(image.reviewId);
    if (review.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this Review Image",
      });
    }

    // Delete the image
    await image.destroy();

    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting Review Image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
