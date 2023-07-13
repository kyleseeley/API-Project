"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAvYCOaD9QHp9yIea8U0cooccb0StQvvHy_A&usqp=CAU",
        },
        {
          reviewId: 1,
          url: "https://www.etonline.com/tv/204084_full_house_creator_jeff_franklin_purchases_original_tanner_house_san_francisco",
        },
        {
          reviewId: 2,
          url: "https://cdn.5280.com/2022/11/i-dkNvBMh-X2-960x720.jpeg",
        },
        {
          reviewId: 3,
          url: "https://s3.us-east-2.amazonaws.com/havenlifestyles/a10515403-1.jpg",
        },
        {
          reviewId: 4,
          url: "https://www.star-telegram.com/latest-news/w8lefo/picture251420508/alternates/LANDSCAPE_1140/Denver%20house%20-1.jpg",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
