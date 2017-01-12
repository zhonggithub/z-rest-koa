/*
 * @Author: Zz
 * @Date: 2017-01-11 18:16:10
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-12 15:01:33
 */
import { verify } from 'z-error';
import { Operator, dbOrm, common, Controller } from '../common';

function convertQueryCriteria(criteria) {
  let tmpCriteria = JSON.parse(JSON.stringify(criteria));
  tmpCriteria = common.convertQueryCriteria(tmpCriteria);
  const dbCriteria = tmpCriteria.dstCriteria;
  tmpCriteria = tmpCriteria.sourceCriteria;
  for (const condition in tmpCriteria) {
    switch (condition) {
      case 'username': {
        if (tmpCriteria[condition].indexOf('*') === -1) {
          dbCriteria[`canton.${condition}`] = tmpCriteria[condition];
        } else {
          const reg = /\*/g;
          const str = criteria[condition].replace(reg, '%');
          dbCriteria[`canton.${condition}`] = { like: str };
        }
      } break;
      default:
        dbCriteria[condition] = tmpCriteria[condition];
        break;
    }
  }
  dbCriteria.deleteFlag = { '!': 1 };
  return dbCriteria;
}

function convertCountCriteria(criteria) {
  const dbCriteria = common.convertCountCriteria(criteria);
  dbCriteria.deleteFlag = { '!': 1 };
  return dbCriteria;
}

function getResourceModel() {
  return dbOrm.collections.tb_account;
}
const accountOperator = new Operator(getResourceModel, null, null, null, convertQueryCriteria, convertCountCriteria);

function isValidData(info) {
  const error = verify(info, ['account']);
  if (error) {
    return { is: false, error };
  }
  return { is: true, error };
}

async function isExist(info) {
  try {
    const result = await accountOperator.list({ account: info.account });
    return {
      is: result.length !== 0,
      description: '',
      infos: result,
    };
  } catch (err) {
    return Promise.reject(err);
  }
}

function retData(body) {
  body = common.filterData(body, ['deleteFlag']);
  body.href = `http://localhost:3000/api/v1/accounts/${body.id}`;
  return body;
}

function retListData(query, items, size) {
  const href = 'http://localhost:3000/api/v1/accounts';
  return common.retListData(query, items, size, retData, href);
}

module.exports = new Controller({
  resourceProxy: accountOperator,
  isValidData,
  isExist,
  retData,
  retListData,
});
