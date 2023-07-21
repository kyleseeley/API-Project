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

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const allBookings = await Booking.findAll({
    where: { userId },
    include: [
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
        ],
        include: [
          {
            model: SpotImage,
            as: "SpotImages",
            attributes: ["url"],
            where: { preview: true },
            required: false,
            limit: 1,
          },
        ],
      },
    ],
  });

  const formattedBookings = allBookings.map((booking) => {
    const { Spot, ...rest } = booking.toJSON();
    const previewImage =
      Spot && Spot.SpotImages && Spot.SpotImages.length > 0
        ? Spot.SpotImages[0].url
        : null;

    const spotAttributes = {
      id: Spot.id,
      ownerId: Spot.ownerId,
      address: Spot.address,
      city: Spot.city,
      state: Spot.state,
      country: Spot.country,
      lat: Spot.lat,
      lng: Spot.lng,
      name: Spot.name,
      price: Spot.price,
      previewImage,
    };

    const startDate = booking.startDate.toISOString().substring(0, 10);
    const endDate = booking.endDate.toISOString().substring(0, 10);

    return {
      id: booking.id,
      spotId: booking.spotId,
      Spot: spotAttributes,
      userId: booking.userId,
      startDate,
      endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  });

  const response = {
    Bookings: formattedBookings,
  };

  res.json(response);
});

router.put("/:bookingId", requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  try {
    // Check if the booking exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the current user
    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Check if the booking is in the past
    const currentDate = new Date();
    if (currentDate > booking.endDate) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    //Check if endDate is before startDate
    if (endDate < startDate) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      where: {
        spotId: booking.spotId,
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
        [Op.not]: {
          id: bookingId,
        },
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

    // Update the booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    // Format the startDate and endDate
    const formattedStartDate = new Date(booking.startDate)
      .toISOString()
      .substring(0, 10);
    const formattedEndDate = new Date(booking.endDate)
      .toISOString()
      .substring(0, 10);

    // Format the response
    const response = {
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    res.json(response);
  } catch (error) {
    console.error("Error editing booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  try {
    // Check if the booking exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the current user or the spot belongs to the current user
    const spot = await Spot.findByPk(booking.spotId);
    if (!(booking.userId === userId || spot.ownerId === userId)) {
      return res.status(403).json({
        message: "You are not authorized to delete this booking",
      });
    }

    // Check if the booking has already started
    const currentDate = new Date();
    if (currentDate > booking.startDate) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    // Delete the booking
    await booking.destroy();

    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
