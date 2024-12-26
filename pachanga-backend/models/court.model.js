// models/court.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modelo de Cancha
const Court = sequelize.define('Court', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinateX: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    coordinateY: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING,   
      allowNull: true,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // 0 -> no validado, 1 -> validado
    },
  },
  {
    timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla
  }
  );


module.exports = Court;

