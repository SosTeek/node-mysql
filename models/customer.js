/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
// const { validator } = require('sequelize/types/lib/utils/validator-extras');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Customer.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: [validator.isEmail, 'Provide a valid email'],
      validate: {
        isEmail: true
      }
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "At least 8 characters required for password"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    phone:{
      type: DataTypes.STRING,
      // allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};