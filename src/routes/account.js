/*
 * @Author: Zz
 * @Date: 2017-01-11 18:16:10
 * @Last Modified by:   Zz
 * @Last Modified time: 2017-01-11 18:16:10
 */

import { Operator, dbOrm, common } from '../common';

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

module.exports = new Operator(dbOrm.collections.tb_account, null, null, null, convertQueryCriteria, convertCountCriteria);
