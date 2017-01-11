import mongodbAdapter from 'sails-mongo';

module.exports = {
  adapters: {
    default: mongodbAdapter,
    mongodb: mongodbAdapter,
  },
  connections: {
    mongodb: {
      adapter: 'mongodb',
      // url : 'mongodb://' + config.configForDB.connection.host + ':' + config.configForDB.connection.port + '/' + config.configForDB.connection.database
      host: 'localhost',
      port: 27017,
      // user: 'root',
      // password : '123456',
      database: 'z-rest-koa',
    },
  },
  defaults: {
    migrate: 'alter',
  },
};
