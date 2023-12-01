// Seed data rewritten to work with our project

const sequelize = require('../config/connection');
const { Users, Locations, Trips, Tagged, Comments, Images } = require('../models');

const userData = require('./userData.json');
const locationData = require('./locationData.json');
const tripData = require('./tripData.json');
const tagData = require('./tagData.json');
const commentData = require('./commentData.json');
const imageData = require('./imageData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await applyOne(Users, userData, true);

  // await Users.bulkCreate(userData, {
  //   individualHooks: true,
  //   returning: true,
  // });
  console.log('\n----- USERS SEEDED -----\n');

  // await Locations.bulkCreate(locationData);
  await applyOne(Locations, locationData);
  console.log('\n----- LOCATIONS SEEDED -----\n');

  // await Trips.bulkCreate(tripData);
  await applyOne(Trips, tripData);
  console.log('\n----- TRIPS SEEDED -----\n');

  // await Tagged.bulkCreate(tagData);
  await applyOne(Tagged, tagData);
  console.log('\n----- TAGGED SEEDED -----\n');

  // await Comments.bulkCreate(commentData);
  await applyOne(Comments, commentData);
  console.log('\n----- Comments SEEDED -----\n');

  // await Images.bulkCreate(imageData);
  await applyOne(Images, imageData);
  console.log('\n----- Images SEEDED -----\n');

  process.exit(0);
};

const applyOne = async (aModel, sourceData, flag = false) => {
  for (const element of sourceData) {
    if (flag) {
      await aModel.create({
        ...element,
        individualHooks: true,
        returning: true,
      });
    } else {
      await aModel.create({
        ...element,
      });
    }
  }
};

seedDatabase();
