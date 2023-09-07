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
          url: "https://media.architecturaldigest.com/photos/62a0fb33e2756c54e4cb9829/16:9/w_960,c_limit/GettyImages-450424041.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://images2.dwell.com/photos/6133553759298379776/6531632504793808896/original.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://images2.dwell.com/photos/6133553759298379776/6531632505875939328/original.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://images2.dwell.com/photos/6133553759298379776/6531632505884327936/original.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://images2.dwell.com/photos/6133553759298379776/6531632506390585344/original.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://mlsandiegomag.com/get/files/image/galleries/9828LJFarms.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://mlsandiegomag.com/get/files/image/galleries/El_Vuelo.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://image.cnbcfm.com/api/v1/image/107057211-532-neptune-ave-102.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://image.cnbcfm.com/api/v1/image/107127831-4001_E_Quincy_Avenue-149.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://nypost.com/wp-content/uploads/sites/2/2022/10/denver-most-expensive-home-feat-image.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://image.cnbcfm.com/api/v1/image/107126805-1664479356640-a4001_E_Quincy_Avenue-198.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://image.cnbcfm.com/api/v1/image/107126795-1664479382715-a4001_E_Quincy_Avenue-197.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/zUsysTDZvzyoh1llHevYw5jSFVE=/0x0:4200x2798/920x613/filters:focal(1927x827:2599x1499):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/55027723/DJI_0225.0.jpeg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/07ukB05R2in-9AgjLLDCybV_rDo=/0x0:1800x1199/920x0/filters:focal(0x0:1800x1199):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8606335/DJI_0256.JPG",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/YUfmTBuIIux3zmGSpl0P7jXwaWg=/0x0:1800x1202/920x0/filters:focal(0x0:1800x1202):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8606351/RIC_1698_G.JPG",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/bOfXGLXmEeMp-kbN_GgkBW2WDCA=/0x0:1800x1202/920x0/filters:focal(0x0:1800x1202):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8606353/RIC_1659_G.JPG",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://cdn.vox-cdn.com/thumbor/lxQe1MtByUDRgHoqAYD7UY6dWXA=/0x0:1800x1202/920x0/filters:focal(0x0:1800x1202):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8606341/RIC_1414_G.JPG",
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
