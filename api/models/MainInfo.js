/**
 * BlogInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
      pageTitle: {
          type: 'string',
          required: true
      },
      headerTitle: {
          type: 'string',
          required: true
      },
      id: {
          type: 'integer',
          unique: true,
          primaryKey: true
      }
  }
};

