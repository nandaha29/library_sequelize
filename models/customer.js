'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ini adalah blok untuk menghubungkan antar model/table

      //menghubungkan customer -> transaksi
      this.hasMany(models.transaksi,{
        foreignKey: "transaksi_id",
        as: "transaksi"
      })

    }
  };
  customer.init({
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },  
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer',
      // setting nama table
      tableName: "customer"
  });
  return customer;
};