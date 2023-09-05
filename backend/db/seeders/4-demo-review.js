"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 2,
          review:
            "We stayed at Full House the week of our elopement and it was seriously beyond beautiful! The place was gorgeous. Clean cozy home and had lots of little details that were amazing.  Demo was very friendly and helpful with every question we had. 10/10.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 3,
          review:
            "Beautiful property and very secluded…which is what we were going for! Highly recommend and we would certainly book again!",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 1,
          review:
            "Amazing, relaxing, spacious, super clean, and serene. Very secluded and remote, but close enough to the city for trips to downtown or Denver Tech Center.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 3,
          review:
            "Beautiful place in a great location. Perfect for our group of 2 families. Host very responsive.Would stay again.",
          stars: 3,
        },
        {
          spotId: 4,
          userId: 2,
          review:
            "This place is absolutely gorgeous and perfect for a large amount of people. Everyone had so much room and the vibe was out of this world. The photos don’t do this place justice! Had the best time in Miami here!",
          stars: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
