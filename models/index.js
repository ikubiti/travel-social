const Users = require('./Users');
const Trips = require('./Trips');
const Tagged = require('./Tagged');
const Images = require('./Images');
const Locations = require('./Locations');
const Comments = require('./Comments');

// A user can have many trips
Users.hasMany(Trips, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// A trip belongs to one user
Trips.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A user can have many images
Users.hasMany(Images, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// Images belong to one user
Images.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A user can belong to many tagged
Users.hasMany(Tagged, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// Tagged belongs to one user
Tagged.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A user can have many comments
Users.hasMany(Comments, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// Comments belongs to one user
Comments.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A trip can have many images
Trips.hasMany(Images, {
  foreignKey: 'trip_id',
  onDelete: 'CASCADE'
});

// Images belong to one trip
Images.belongsTo(Trips, {
  foreignKey: 'trip_id'
});

// Trips have many Tagged
Trips.hasMany(Tagged, {
  foreignKey: 'trip_id',
  onDelete: 'CASCADE'
});

// Tagged belongs to one trip
Tagged.belongsTo(Trips, {
  foreignKey: 'trip_id'
});

// A trip can have many comments
Trips.hasMany(Comments, {
  foreignKey: 'trip_id',
  onDelete: 'CASCADE'
});

// Comments belongs to one trip
Comments.belongsTo(Trips, {
  foreignKey: 'trip_id'
});

// A location can have many Comments
Locations.hasMany(Comments, {
  foreignKey: 'location_id',
  onDelete: 'CASCADE'
});

// Comments belongs to one location
Comments.belongsTo(Locations, {
  foreignKey: 'location_id'
});

module.exports = { Users, Trips, Tagged, Images, Locations, Comments };
