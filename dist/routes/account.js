'use strict';

let isExist = (() => {
  var _ref = _asyncToGenerator(function* (info) {
    try {
      const result = yield accountOperator.list({ account: info.account });
      return {
        is: result.length !== 0,
        description: '',
        infos: result
      };
    } catch (err) {
      return Promise.reject(err);
    }
  });

  return function isExist(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _zError = require('z-error');

var _common = require('../common');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Author: Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Date: 2017-01-11 18:16:10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Last Modified by: Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Last Modified time: 2017-01-12 15:01:33
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


function convertQueryCriteria(criteria) {
  let tmpCriteria = JSON.parse(JSON.stringify(criteria));
  tmpCriteria = _common.common.convertQueryCriteria(tmpCriteria);
  const dbCriteria = tmpCriteria.dstCriteria;
  tmpCriteria = tmpCriteria.sourceCriteria;
  for (const condition in tmpCriteria) {
    switch (condition) {
      case 'username':
        {
          if (tmpCriteria[condition].indexOf('*') === -1) {
            dbCriteria[`canton.${ condition }`] = tmpCriteria[condition];
          } else {
            const reg = /\*/g;
            const str = criteria[condition].replace(reg, '%');
            dbCriteria[`canton.${ condition }`] = { like: str };
          }
        }break;
      default:
        dbCriteria[condition] = tmpCriteria[condition];
        break;
    }
  }
  dbCriteria.deleteFlag = { '!': 1 };
  return dbCriteria;
}

function convertCountCriteria(criteria) {
  const dbCriteria = _common.common.convertCountCriteria(criteria);
  dbCriteria.deleteFlag = { '!': 1 };
  return dbCriteria;
}

function getResourceModel() {
  return _common.dbOrm.collections.tb_account;
}
const accountOperator = new _common.Operator(getResourceModel, null, null, null, convertQueryCriteria, convertCountCriteria);

function isValidData(info) {
  const error = (0, _zError.verify)(info, ['account']);
  if (error) {
    return { is: false, error };
  }
  return { is: true, error };
}

function retData(body) {
  body = _common.common.filterData(body, ['deleteFlag']);
  body.href = `http://localhost:3000/api/v1/accounts/${ body.id }`;
  return body;
}

function retListData(query, items, size) {
  const href = 'http://localhost:3000/api/v1/accounts';
  return _common.common.retListData(query, items, size, retData, href);
}

module.exports = new _common.Controller({
  resourceProxy: accountOperator,
  isValidData,
  isExist,
  retData,
  retListData
});