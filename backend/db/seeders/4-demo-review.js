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
          userId: 1,
          review: "This was an awesome spot!",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 1,
          review: "Not too shabby",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 1,
          review: "Slept Great",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 2,
          review: "This place was alright",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 3,
          review: "Not enough toilet paper",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 3,
          review: "Very Sporty",
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
