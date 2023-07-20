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
const { Sequelize, literal } = require("sequelize");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const size = parseInt(req.query.size || 20);
  const minLat = parseFloat(req.query.minLat);
  const maxLat = parseFloat(req.query.maxLat);
  const minLng = parseFloat(req.query.minLng);
  const maxLng = parseFloat(req.query.maxLng);
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  try {
    const isQueryPresent = Object.keys(req.query).length > 0;
    // Query parameters validation
    const validationErrors = {};
    if (isNaN(page) || page < 1) {
      validationErrors.page = "Page must be greater than or equal to 1";
    }
    if (isNaN(size) || size < 1) {
      validationErrors.size = "Size must be greater than or equal to 1";
    }
    if (!isNaN(minLat) && (minLat < -90 || minLat > 90)) {
      validationErrors.minLat = "Minimum latitude is invalid";
    }
    if (!isNaN(maxLat) && (maxLat < -90 || maxLat > 90)) {
      validationErrors.maxLat = "Maximum latitude is invalid";
    }
    if (!isNaN(minLng) && (minLng < -180 || minLng > 180)) {
      validationErrors.minLng = "Minimum longitude is invalid";
    }
    if (!isNaN(maxLng) && (maxLng < -180 || maxLng > 180)) {
      validationErrors.maxLng = "Maximum longitude is invalid";
    }
    if (!isNaN(minPrice) && minPrice < 0) {
      validationErrors.minPrice =
        "Minimum price must be greater than or equal to 0";
    }
    if (!isNaN(maxPrice) && maxPrice < 0) {
      validationErrors.maxPrice =
        "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors: validationErrors,
      });
    }

    // Build the filter object
    const filter = {};
    if (!isNaN(minLat) && !isNaN(maxLat)) {
      filter.lat = {
        [Op.between]: [minLat, maxLat],
      };
    }
    if (!isNaN(minLng) && !isNaN(maxLng)) {
      filter.lng = {
        [Op.between]: [minLng, maxLng],
      };
    }
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      // Updated condition here
      filter.price = {};
      if (!isNaN(minPrice)) {
        filter.price[Op.gte] = minPrice;
      }
      if (!isNaN(maxPrice)) {
        filter.price[Op.lte] = maxPrice;
      }
    }

    // Query the database to fetch all spots based on the filter
    const allSpots = await Spot.findAndCountAll({
      where: filter,
      order: [["id"]],
      limit: size,
      offset: (page - 1) * size,
      include: [
        {
          model: Review,
          as: "Reviews",
          attributes: ["stars"],
        },
        {
          model: SpotImage,
          as: "SpotImages",
          attributes: ["id", "url", "preview"],
          where: { preview: true },
          required: false,
        },
      ],
    });

    const totalCount = allSpots.count;

    // Get all spot IDs
    const spotIds = allSpots.rows.map((spot) => spot.id);

    // Fetch associated reviews for all spots
    const reviews = await Review.findAll({
      attributes: [
        "spotId",
        [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
      ],
      where: { spotId: allSpots.rows.map((spot) => spot.id) },
      group: ["spotId"],
      raw: true,
    });

    // Fetch associated spot images for all spots
    const spotImages = await SpotImage.findAll({
      where: {
        spotId: allSpots.rows.map((spot) => spot.id),
        preview: true,
      },
    });

    // Format the response
    const formattedSpots = allSpots.rows.map((spot) => {
      const formattedSpot = {
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
      };

      // Find the corresponding review for the spot, if it exists
      const spotReview = reviews.find((review) => review.spotId === spot.id);

      console.log("spotReviews:", spotReview);

      if (spotReview && typeof spotReview.avgRating === "number") {
        console.log("spotReview.avgRating:", spotReview.avgRating);
        formattedSpot.avgRating = Math.round(spotReview.avgRating * 10) / 10;
      } else {
        formattedSpot.avgRating = null;
      }

      // Find the corresponding spot image for the spot, if it exists
      const spotImage = spot.SpotImages && spot.SpotImages[0];
      formattedSpot.previewImage = spotImage ? spotImage.url : null;

      return formattedSpot;
    });

    console.log("formattedSpots:", formattedSpots);

    // Prepare the response object
    const response = { Spots: formattedSpots };
    if (isQueryPresent) {
      if (page > 0) {
        response.page = page;
      }
      if (size > 0) {
        response.size = size;
      }
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const userSpots = await Spot.findAll({
      where: { ownerId: userId },
      order: [["id", "ASC"]],
      include: [
        {
          model: Review,
          as: "Reviews",
          attributes: [],
        },
      ],
      raw: true,
      group: [
        "Spot.id",
        "Spot.ownerId",
        "Spot.address",
        "Spot.city",
        "Spot.state",
        "Spot.country",
        "Spot.lat",
        "Spot.lng",
        "Spot.name",
        "Spot.description",
        "Spot.price",
        "Spot.createdAt",
        "Spot.updatedAt",
      ],
    });

    // Fetch the average rating for all spots owned by the user
    const avgRatings = await Review.findAll({
      attributes: [
        "spotId",
        [Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"],
      ],
      where: { spotId: userSpots.map((spot) => spot.id) },
      group: ["spotId"],
      raw: true,
    });

    // Convert the avgRatings array into an object for easy lookup
    const avgRatingsObj = {};
    avgRatings.forEach((rating) => {
      avgRatingsObj[rating.spotId] = parseFloat(rating.avgStarRating);
    });

    // Fetch associated spot images for all spots owned by the user
    const spotImages = await SpotImage.findAll({
      where: {
        spotId: userSpots.map((spot) => spot.id),
        preview: true,
      },
    });

    // Convert the spotImages array into an object for easy lookup
    const spotImagesObj = {};
    spotImages.forEach((image) => {
      spotImagesObj[image.spotId] = image.url;
    });

    // Format the response
    const formattedSpots = userSpots.map((spot) => {
      const formattedSpot = {
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
        avgRating: avgRatingsObj[spot.id] || null,
        previewImage: spotImagesObj[spot.id] || null,
      };

      return formattedSpot;
    });

    res.json({
      Spots: formattedSpots,
    });
  } catch (error) {
    console.error("Error fetching spots for current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findAndCountAll({
      where: { id: spotId },
      include: [
        {
          model: SpotImage,
          as: "SpotImages",
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "Owners",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Review,
          attributes: [],
        },
      ],
    });

    if (spot.count === 0) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const avgRating = await Review.findOne({
      attributes: [
        [Sequelize.literal("ROUND(AVG(stars), 1)"), "avgStarRating"],
      ],
      where: { spotId },
    });

    const response = {
      id: spot.rows[0].id,
      ownerId: spot.rows[0].ownerId,
      address: spot.rows[0].address,
      city: spot.rows[0].city,
      state: spot.rows[0].state,
      country: spot.rows[0].country,
      lat: spot.rows[0].lat,
      lng: spot.rows[0].lng,
      name: spot.rows[0].name,
      description: spot.rows[0].description,
      price: spot.rows[0].price,
      createdAt: spot.rows[0].createdAt,
      updatedAt: spot.rows[0].updatedAt,
      numReviews: spot.count,
      avgStarRating: avgRating && avgRating.getDataValue("avgStarRating"),
      SpotImages: spot.rows[0].SpotImages,
      Owner: spot.rows[0].Owners,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id;

  const errors = {};
  // ... (your validation code)

  // If there are validation errors, return the error response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  try {
    // Check if a spot with the same address, city, and state already exists
    const existingSpot = await Spot.findOne({
      where: {
        address,
        city,
        state,
      },
    });

    if (existingSpot) {
      // Spot with the same address, city, and state already exists
      return res.status(409).json({
        message: "Conflict",
        errors: { duplicate: "Spot with the same address already exists" },
      });
    }

    // Create the new spot if no duplicate is found
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
    console.log(newSpot);

    return res.json(newSpot);
  } catch (error) {
    console.error("Error creating new spot:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const ownerId = req.user.id;

  const spot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    // Current user doesn't have access to the spot
    return res.status(403).json({ message: "Forbidden" });
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
  if (isNaN(parseFloat(lat)) || lat < -90 || lat > 90) {
    errors.lat = "Latitude is not valid";
  }
  if (isNaN(parseFloat(lng)) || lng < -180 || lng > 180) {
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
    where: { id: spotId },
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    // Current user doesn't have access to the spot
    return res.status(403).json({ message: "Forbidden" });
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
    where: { id: spotId },
    include: [{ model: SpotImage, as: "SpotImages" }],
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    // Current user doesn't have access to the spot
    return res.status(403).json({ message: "Forbidden" });
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
  let response;

  if (spot.ownerId === userId) {
    // If the user is the owner of the spot, include user details in the response
    bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
    response = {
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
  } else {
    // If the user is not the owner of the spot, only include booking details in the response
    bookings = await Booking.findAll({
      where: { spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
    response = {
      Bookings: bookings.map((booking) => {
        const formattedBooking = booking.toJSON();

        const startDate = booking.startDate.toISOString().substring(0, 10);
        const endDate = booking.endDate.toISOString().substring(0, 10);
        return {
          ...formattedBooking,
          startDate,
          endDate,
        };
      }),
    };
  }
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

    // Check if startDate is in the past
    const currentDate = new Date().toISOString().substring(0, 10);
    if (startDate < currentDate) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "Start date cannot be in the past",
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
