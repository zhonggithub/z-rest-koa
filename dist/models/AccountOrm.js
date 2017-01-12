'use strict';

var _waterline = require('waterline');

var _waterline2 = _interopRequireDefault(_waterline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---- Account
module.exports = _waterline2.default.Collection.extend({
  identity: 'tb_account',
  tableName: 'tb_account',
  connection: 'mongodb',
  schema: true,
  attributes: {
    username: {
      type: 'string',
      defaultsTo: ''
    },
    account: {
      type: 'string',
      defaultsTo: ''
    },
    password: {
      type: 'string',
      defaultsTo: ''
    },
    deleteFlag: {
      type: 'integer',
      defaultsTo: 0
    }
  }
});