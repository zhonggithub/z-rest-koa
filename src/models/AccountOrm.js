import Waterline from 'waterline';
// ---- Account
module.exports = Waterline.Collection.extend({
  identity: 'tb_account',
  tableName: 'tb_account',
  connection: 'mongodb',
  schema: true,
  attributes: {
    name: {
      type: 'string',
      unique: true,
    },
    account: {
      type: 'string',
      unique: true,
    },
    password: {
      type: 'string',
    },
    deleteFlag: {
      type: 'integer',
      defaultsTo: 0,
    },
  },
});
