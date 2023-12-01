const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tagged extends Model { }

Tagged.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    trip_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'trips',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tagged',
  }
);

module.exports = Tagged;
