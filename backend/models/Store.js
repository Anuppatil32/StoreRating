const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const User = require('./User'); // Required for association

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 400],
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Associate store with owner
Store.belongsTo(User, {
  foreignKey: 'ownerId',
  onDelete: 'CASCADE',
});

module.exports = Store;
