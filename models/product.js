'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ini adalah blok untuk menghubungkan antar model/table
      // tidak perlu :)
    }
  };
  product.init({
    // product_id blm ada
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },  
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    stock: DataTypes.DOUBLE,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
      // setting nama table
      tableName: "product"
  });
  return product;
};