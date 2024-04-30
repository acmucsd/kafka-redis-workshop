const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  restaurant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driverId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  orderDetails: {
    type: DataTypes.JSON,
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  },
});

module.exports = Order;