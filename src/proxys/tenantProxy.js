/*
 * @Author: Zz
 * @Date: 2017-01-11 18:16:10
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-14 22:10:23
 */
import { verify } from 'z-error';
import { common, resourceProxyFactory } from '../common';
import { tenantOperator } from '../operators';

function isValidData(info) {
  const error = verify(info, ['name']);
  if (error) {
    return { is: false, error };
  }
  return { is: true, error };
}

async function isExist(info) {
  try {
    const result = await tenantOperator.list({ name: info.name });
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
  body.href = `http://localhost:3000/api/v1/tenants/${body.id}`;
  return body;
}

function retListData(query, items, size) {
  const href = 'http://localhost:3000/api/v1/tenants';
  return common.retListData(query, items, size, retData, href);
}

module.exports = resourceProxyFactory({
  resourceProxy: tenantOperator,
  isValidData,
  isExist,
  retData,
  retListData,
});
