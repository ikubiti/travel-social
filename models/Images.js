const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Images extends Model { }

Images.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(400),
    },
    image_name: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(800),
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    modelName: 'images',
  }
);

module.exports = Images;
