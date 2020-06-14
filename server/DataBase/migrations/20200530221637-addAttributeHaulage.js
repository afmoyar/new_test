'use strict';

module.exports = {

  // Add End_date column
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Haulage',
      'End_date',
      Sequelize.DATE
    );
  },

  // Remove End_date column
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Haulage',
      'End_date'
    );
  }
};
