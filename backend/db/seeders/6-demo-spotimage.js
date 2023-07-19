"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://ca-times.brightspotcdn.com/dims4/default/ec1e935/2147483647/strip/true/crop/853x1174+0+0/resize/1200x1652!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F56%2Ffb%2Fc6a8870e648199bbd5cdb3947765%2Fla-fi-hotprop-full-house-jeff-franklin-2019051-001",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/cd/2e/ae/nighttime-nostalgia.jpg?w=1200&h=-1&s=1",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://mlsandiegomag.com/get/files/image/galleries/9828LJFarms.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://image.cnbcfm.com/api/v1/image/107127831-4001_E_Quincy_Avenue-149.jpg?v=1664790001",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://nypost.com/wp-content/uploads/sites/2/2022/10/denver-most-expensive-home-feat-image.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://images.wsj.net/im-535702/?width=1278&size=1",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/Yg8yO151MUkPkRn-jgE5iU-oNU4=/0x0:1024x767/1200x900/filters:focal(431x303:593x465):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/62569176/IS6257src1nr7p0000000000.0.0.jpg",
          preview: false,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
