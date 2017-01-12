'use strict';

var _sailsMongo = require('sails-mongo');

var _sailsMongo2 = _interopRequireDefault(_sailsMongo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  adapters: {
    default: _sailsMongo2.default,
    mongodb: _sailsMongo2.default
  },
  connections: {
    mongodb: {
      adapter: 'mongodb',
      // url : 'mongodb://' + config.configForDB.connection.host + ':' + config.configForDB.connection.port + '/' + config.configForDB.connection.database
      host: 'localhost',
      port: 27017,
      // user: 'root',
      // password : '123456',
      database: 'z-rest-koa'
    }
  },
  defaults: {
    migrate: 'safe'
  }
};