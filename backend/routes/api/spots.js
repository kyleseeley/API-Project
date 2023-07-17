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
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

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

router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId, {
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

router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id;

  const errors = {};
  if (!address) {
    errors.address = "Street address is required";
  }
  if (!city) {
    errors.city = "City is required";
  }
  if (!state) {
    errors.state = "State is required";
  }
  if (!country) {
    errors.country = "Country is required";
  }
  if (isNaN(parseFloat(lat))) {
    errors.lat = "Latitude is not valid";
  }
  if (isNaN(parseFloat(lng))) {
    errors.lng = "Longitude is not valid";
  }
  if (!name || name.length > 49) {
    errors.name = "Name must be less than 50 characters";
  }
  if (!description) {
    errors.description = "Description is required";
  }
  if (!price) {
    errors.price = "Price per day is required";
  }

  // If there are validation errors, return the error response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  return res.json(newSpot);
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const ownerId = req.user.id;

  const spot = await Spot.findOne({
    where: { id: spotId, ownerId },
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  });
  const { id } = newImage;
  res.json({
    id,
    url,
    preview,
  });
});

router.put("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const ownerId = req.user.id;

  const errors = {};
  if (!address) {
    errors.address = "Street address is required";
  }
  if (!city) {
    errors.city = "City is required";
  }
  if (!state) {
    errors.state = "State is required";
  }
  if (!country) {
    errors.country = "Country is required";
  }
  if (isNaN(parseFloat(lat))) {
    errors.lat = "Latitude is not valid";
  }
  if (isNaN(parseFloat(lng))) {
    errors.lng = "Longitude is not valid";
  }
  if (!name || name.length > 49) {
    errors.name = "Name must be less than 50 characters";
  }
  if (!description) {
    errors.description = "Description is required";
  }
  if (!price) {
    errors.price = "Price per day is required";
  }

  // If there are validation errors, return the error response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  const spot = await Spot.findOne({
    where: { id: spotId, ownerId },
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;
  await spot.save();

  res.json(spot);
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const ownerId = req.user.id;

  const spot = await Spot.findOne({
    where: { id: spotId, ownerId },
    include: [{ model: SpotImage }],
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  await Promise.all(spot.SpotImages.map((image) => image.destroy()));

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  res.json({ Reviews: reviews });
});

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the user already has a review for the spot
  const existingReview = await Review.findOne({
    where: { spotId, userId },
  });
  if (existingReview) {
    return res
      .status(403)
      .json({ message: "User already has a review for this spot" });
  }

  // Validate the request body
  if (!review) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { review: "Review text is required" },
    });
  }
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { stars: "Stars must be an integer from 1 to 5" },
    });
  }

  // Create the review
  try {
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    res.status(201).json(newReview);
  } catch (error) {
    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.reduce((acc, cur) => {
        acc[cur.path] = cur.message;
        return acc;
      }, {});

      return res.status(400).json({ message: "Validation error", errors });
    }

    // Handle other errors
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  let bookings;

  if (spot.ownerId === userId) {
    // If the user is the owner of the spot, include user details in the response
    bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
  } else {
    // If the user is not the owner of the spot, only include booking details in the response
    bookings = await Booking.findAll({
      where: { spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
  }

  const response = {
    Bookings: bookings.map((booking) => {
      const formattedBooking = booking.toJSON();
      const user = formattedBooking.User
        ? {
            id: formattedBooking.User.id,
            firstName: formattedBooking.User.firstName,
            lastName: formattedBooking.User.lastName,
          }
        : null;
      delete formattedBooking.User;

      const startDate = booking.startDate.toISOString().substring(0, 10);
      const endDate = booking.endDate.toISOString().substring(0, 10);
      return {
        User: user,
        ...formattedBooking,
        startDate,
        endDate,
      };
    }),
  };

  res.json(response);
});

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the spot belongs to the current user
    if (spot.ownerId === userId) {
      return res.status(403).json({
        message: "You are the owner of this spot and cannot book it",
      });
    }

    // Validate startDate and endDate
    if (endDate <= startDate) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate,
            },
            endDate: {
              [Op.gte]: startDate,
            },
          },
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    // Format the startDate and endDate
    const formattedStartDate = new Date(startDate)
      .toISOString()
      .substring(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().substring(0, 10);

    // Create the booking
    const newBooking = await Booking.create({
      spotId,
      userId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });

    // Manually format the response
    const response = {
      id: newBooking.id,
      spotId: newBooking.spotId,
      userId: newBooking.userId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      createdAt: newBooking.createdAt,
      updatedAt: newBooking.updatedAt,
    };

    res.json(response);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
