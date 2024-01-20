// course model
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    static associate(models) {
      course.belongsTo(models.users, {
        foreignKey: "creatorId",
        as: "creator",
      });
    }
  }
  course.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      creatorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "course",
    }
  );
  return course;
};
