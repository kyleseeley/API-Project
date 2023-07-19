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
              '(SELECT url FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)'
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

router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;
  const { url } = req.body;

  // Check if the review exists and belongs to the current user
  const review = await Review.findOne({
    where: { id: reviewId, userId },
  });
  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Check the number of existing images for the review
  const existingImages = await ReviewImage.count({ where: { reviewId } });
  if (existingImages > 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  // Create the new image for the review
  try {
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    res.json({ id: newImage.id, url: newImage.url });
  } catch (error) {
    console.error("Error adding image to review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;
  const { review, stars } = req.body;

  // Check if the review exists and belongs to the current user
  const existingReview = await Review.findOne({
    where: { id: reviewId, userId },
  });
  if (!existingReview) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Body validation
  const errors = {};
  if (!review) {
    errors.review = "Review text is required";
  }
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  // If there are validation errors, return the error response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  // Update the review
  try {
    const updatedReview = await existingReview.update({
      review,
      stars,
    });

    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  // Check if the review exists and belongs to the current user
  const existingReview = await Review.findOne({
    where: { id: reviewId, userId },
    include: [{ model: ReviewImage, as: "ReviewImages" }],
  });
  if (!existingReview) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Delete the associated ReviewImage records
  await Promise.all(
    existingReview.ReviewImages.map((image) => image.destroy())
  );

  // Delete the review
  try {
    await existingReview.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
