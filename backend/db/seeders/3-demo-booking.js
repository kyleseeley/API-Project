"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2023-05-05"),
          endDate: new Date("2023-05-07"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2023-07-16"),
          endDate: new Date("2023-07-25"),
        },
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2024-07-16"),
          endDate: new Date("2024-07-25"),
        },
        {
          spotId: 3,
          userId: 2,
          startDate: new Date("2023-10-15"),
          endDate: new Date("2023-10-22"),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2023-09-01"),
          endDate: new Date("2023-09-05"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
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
