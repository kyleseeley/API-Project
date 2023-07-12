"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
          avgRating: 4.5,
          previewImage:
            "https://ca-times.brightspotcdn.com/dims4/default/ec1e935/2147483647/strip/true/crop/853x1174+0+0/resize/1200x1652!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F56%2Ffb%2Fc6a8870e648199bbd5cdb3947765%2Fla-fi-hotprop-full-house-jeff-franklin-2019051-001",
        },
        {
          ownerId: 2,
          address: "456 Comic Street",
          city: "Denver",
          state: "Colorado",
          country: "United States of America",
          lat: 39.7392,
          lng: 104.9903,
          name: "Rocky Mountains",
          description: "Beautiful scenery",
          price: 350,
          avgRating: 3.9,
          previewImage:
            "https://image.cnbcfm.com/api/v1/image/107127831-4001_E_Quincy_Avenue-149.jpg?v=1664790001",
        },
        {
          ownerId: 3,
          address: "789 Sports Circle",
          city: "Miami",
          state: "Florida",
          country: "United States of America",
          lat: 25.7617,
          lng: 80.1918,
          name: "South Beach Palace",
          description: "Welcome to Miami",
          price: 689,
          avgRating: 2.7,
          previewImage: "https://images.wsj.net/im-535702/?width=1278&size=1",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: ["App Academy", "Rocky Mountains", "South Beach Palace"],
        },
      },
      {}
    );
  },
};
