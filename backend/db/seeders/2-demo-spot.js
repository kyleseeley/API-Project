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
          address: "714 Steiner Street",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "Stay in our 'Full House'",
          description:
            "Most notably viewed in the opening credits of the ’80s sitcom Full House, one of San Francisco’s famed “Painted Ladies” is available for your family stay. The house, which is located at 714 Steiner Street, is one of seven Victorian-style homes that make up a picturesque block, also referred to as “Postcard Row,” across from Alamo Square Park in the city’s Western Addition. ",
          price: 123,
        },
        {
          ownerId: 1,
          address: "999 Ocean View Circle",
          city: "San Diego",
          state: "California",
          country: "United States of America",
          lat: 32.7157,
          lng: -117.1611,
          name: "Call Your Bluff",
          description:
            "Perched atop its own sea bluff, this very private 8,627-square-foot residence with five bedrooms and seven baths takes full advantage of the natural surroundings with walls of glass and stone terraces from which to watch the sunset. The 1.19-acre property also includes a Savant home automation system, infinity pool, guest house and studio.",
          price: 712,
        },
        {
          ownerId: 2,
          address: "456 Rockies Street",
          city: "Denver",
          state: "Colorado",
          country: "United States of America",
          lat: 39.7392,
          lng: -104.9903,
          name: "Clearview Farm",
          description:
            "The estate spans nearly 15 acres with a 1.5-acre pond and unobstructed views of the Rocky Mountains. The residence unfolds over two separate structures including an almost 13,800-square-foot main house with a multitiered sundeck and partially subterranean level that connects to a two-story poolside structure.",
          price: 350,
        },
        {
          ownerId: 3,
          address: "789 Hurricane Circle",
          city: "Miami",
          state: "Florida",
          country: "United States of America",
          lat: 25.7617,
          lng: -80.1918,
          name: "South Beach Palace",
          description:
            "Situated on the exclusive, gated La Gorce Island in Miami Beach, the Pearce compound boasts three homes — two two-story residences and a smaller one-story home with a guesthouse — each with its own private dock. In total, there are 12 bedrooms, 16 full bathrooms, nine half-bathrooms, and three swimming pools. The nearly three-acre property boasts statues of Greek gods and goddesses, opulent marble floors, handpainted frescos on the ceiling, crystal chandeliers, an extravagant Spanish-style courtyard, and 600 feet of frontage on Biscayne Bay with panoramic views of the Miami skyline. Not to mention a wine cellar, a vintage movie theater, and a private waterfront park on the property called 'Domaine de la Paix et de l’Amour' (French for 'Domain of Peace and Love'), decked out with manicured greenery and a waterfront gazebo.",
          price: 689,
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
