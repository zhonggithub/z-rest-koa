import Waterline from 'waterline';
// ---- Account
module.exports = Waterline.Collection.extend({
  identity: 'tb_account',
  tableName: 'tb_account',
  connection: 'mongodb',
  schema: true,
  attributes: {
    username: {
      type: 'string',
      defaultsTo: '',
    },
    account: {
      type: 'string',
      defaultsTo: '',
    },
    password: {
      type: 'string',
      defaultsTo: '',
    },
    deleteFlag: {
      type: 'integer',
      defaultsTo: 0,
    },
  },
});
