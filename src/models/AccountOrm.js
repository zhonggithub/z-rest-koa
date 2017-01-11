import waterline from 'waterline';
// ---- Account
module.exports = waterline.Collection.extend({
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
    status: {
      type: 'integer',
      defaultsTo: 0,
    },
    deleteFlag: {
      type: 'integer',
      defaultsTo: 0,
    },
  },
});
