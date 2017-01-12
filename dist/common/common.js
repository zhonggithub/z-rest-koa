'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _zError = require('z-error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ProjectName: zcmex
 * FileName: ZCommon.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/19
 * Description:
 */
class Common {
  constructor() {
    this.getIdInHref = (href, reg, lastReg) => {
      let serviceReg = new RegExp(reg);
      let serviceResult = serviceReg.exec(href);
      const subStr = href.substr(serviceResult.index + serviceResult[0].length);
      if (!lastReg) {
        return subStr;
      }
      serviceReg = new RegExp(lastReg);
      serviceResult = serviceReg.exec(subStr);
      return subStr.substr(0, serviceResult.index);
    };

    this.generateUUID = () => {
      let p;
      do {
        const md5 = _crypto2.default.createHash('md5');
        p = md5.update(_nodeUuid2.default.v1()).digest('base64');
      } while (p.indexOf('/') !== -1 || p.indexOf('+') !== -1);
      return p.substr(0, p.length - 2);
    };

    this.ifReturnTrue = value => value !== null && value !== undefined;

    this.ifReturnStr = (value, str) => {
      if (value === null || value === undefined) {
        return str || '';
      }
      return String(value);
    };

    this.ifReturnNum = (value, num) => {
      if (value === null || value === undefined) {
        return num || 0;
      }
      return Number(value);
    };

    this.koaErrorReturn = (res, status, error) => {
      res.status = status || 500;
      res.type = this.retContentType;

      const body = {
        name: error && error.name ? error.name : 'Error',
        code: error && error.code ? error.code : 9999,
        message: error && error.message ? error.message : 'Unknown Error',
        description: error && error.description ? error.description : '',
        stack: error && error.stack ? error.stack : ''
      };
      res.body = JSON.stringify(body);
    };

    this.filterData = (dataInfo, excludeAttribute) => {
      const retDataInfo = Object.assign({}, dataInfo);
      for (let i = 0; i < excludeAttribute.length; i += 1) {
        delete retDataInfo[excludeAttribute[i]];
      }
      return retDataInfo;
    };

    this.isHasExpandAttribute = queryConditions => {
      if (!queryConditions) {
        return false;
      }
      if ({}.hasOwnProperty.call(queryConditions, 'expand')) {
        return true;
      }
      return false;
    };

    this.getExpand = expandStr => {
      const reg = /[(:,)]/;
      const strArray = expandStr.split(reg);
      let offset = 0;
      let limit = 10;
      let key = '';
      key = strArray[0];
      if (strArray.length > 5 && strArray[1] === 'offset' && strArray[3] === 'limit') {
        offset = Number(strArray[2]);
        limit = Number(strArray[4]);
      } else if (strArray.length > 5 && strArray[3] === 'offset' && strArray[1] === 'limit') {
        offset = Number(strArray[4]);
        limit = Number(strArray[2]);
      } else {
        key = expandStr;
      }
      return [key, offset, limit];
    };

    this.isOnly = (error, results) => {
      const retData = { is: true, error: '', flag: 0 };
      if (error) {
        retData.error = error;
        retData.is = false;
        retData.flag = 3;
        return retData;
      }
      if (results.length === 0) {
        const err = new _zError.ZError('SyntaxError', 404, 7038);
        err.description = 'Could not find the resource.';
        retData.error = err;
        retData.is = false;
        retData.flag = 1;
        return retData;
      } else if (results.length > 1) {
        const err = new _zError.ZError('InternalError', 409, 7037);
        err.description = 'Find much resource.';
        retData.error = err;
        retData.is = false;
        retData.flag = 2;
        return retData;
      }
      return retData;
    };

    this.error404 = () => {
      const error = new _zError.ZError('InternalError', 404, 7038);
      error.description = 'Could not find the resource.';
      return error;
    };

    this.error409 = () => {
      const error = new _zError.ZError('InternalError', 409, 7037);
      error.description = 'the resource is exist.';
      return error;
    };

    this.error500 = () => {
      const error = new _zError.ZError('InternalError', 500, 9999);
      return error;
    };

    this.convertQueryCriteria = (criteria, isDefault) => {
      const dbCriteria = {};
      const filterAttributeArray = [];
      for (const condition in criteria) {
        switch (condition) {
          case 'limit':
            dbCriteria[condition] = this.ifReturnNum(criteria[condition], this.defaultLimit);
            filterAttributeArray.push(condition);
            break;
          case 'offset':
            dbCriteria.skip = this.ifReturnNum(criteria[condition], this.defaultOffet);
            filterAttributeArray.push(condition);
            break;
          case 'sort':
            {
              dbCriteria.sort = {};
              const array = criteria[condition].split(',');
              for (let i = 0; i < array.length; i += 1) {
                const tmpArray = array[i].split(' ');
                if (tmpArray.length !== 2) {
                  dbCriteria.sort[tmpArray[0]] = 'asc';
                } else if (tmpArray.length === 2) {
                  dbCriteria.sort[tmpArray[0]] = tmpArray[1];
                }
              }
              filterAttributeArray.push(condition);
            }break;
          case 'createdAt':
          case 'updatedAt':
            {
              dbCriteria[condition] = {};
              const beginStr = criteria[condition][0];
              const endStr = criteria[condition][criteria[condition].length - 1];
              if (beginStr === '[' || beginStr === '(' || beginStr === '{') {
                let array = criteria[condition];
                array = array.replace(/(\[)|(\])|(\()|(\))|(\{)|(\})/g, '');
                array = array.split(',');
                if (beginStr === '[' && endStr === ']') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>='] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<='] = new Date(array[1]);
                  }
                } else if (beginStr === '(' && endStr === ']') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>'] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<='] = new Date(array[1]);
                  }
                } else if (beginStr === '[' && endStr === ')') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>='] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<'] = new Date(array[1]);
                  }
                } else if (beginStr === '(' && endStr === ')') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>'] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<'] = new Date(array[1]);
                  }
                } else if (beginStr === '{' && endStr === '}') {
                  dbCriteria[condition] = array;
                }
              } else {
                dbCriteria[condition] = criteria[condition];
              }
              filterAttributeArray.push(condition);
            }break;
          case 'expand':
            break;
          case 'name':
            {
              if (criteria[condition].indexOf('*') === -1) {
                dbCriteria[condition] = criteria[condition];
              } else {
                const reg = /\*/g;
                const str = criteria[condition].replace(reg, '%');
                dbCriteria[condition] = { like: str };
              }
              filterAttributeArray.push(condition);
            }break;
          default:
            if (isDefault) {
              dbCriteria[condition] = criteria[condition];
              filterAttributeArray.push(condition);
            }
            break;
        }
      }

      criteria = this.filterData(criteria, filterAttributeArray);
      return { dstCriteria: dbCriteria, sourceCriteria: criteria };
    };

    this.convertCountCriteria = (criteria, isDefault) => {
      const dbCriteria = {};
      for (const condition in criteria) {
        switch (condition) {
          case 'limit':
          case 'offset':
          case 'sort':
          case 'expand':
            break;
          case 'createdAt':
          case 'updatedAt':
            {
              dbCriteria[condition] = {};
              const beginStr = criteria[condition][0];
              const endStr = criteria[condition][criteria[condition].length - 1];
              if (beginStr === '[' || beginStr === '(' || beginStr === '{') {
                let array = criteria[condition];
                array = array.replace(/(\[)|(\])|(\()|(\))|(\{)|(\})/g, '');
                array = array.split(',');
                if (beginStr === '[' && endStr === ']') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>='] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<='] = new Date(array[1]);
                  }
                } else if (beginStr === '(' && endStr === ']') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>'] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<='] = new Date(array[1]);
                  }
                } else if (beginStr === '[' && endStr === ')') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>='] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<'] = new Date(array[1]);
                  }
                } else if (beginStr === '(' && endStr === ')') {
                  if (array[0] !== ' ' && array[0] !== '') {
                    dbCriteria[condition]['>'] = new Date(array[0]);
                  }
                  if (array[1] !== ' ' && array[1] !== '') {
                    dbCriteria[condition]['<'] = new Date(array[1]);
                  }
                } else if (beginStr === '{' && endStr === '}') {
                  dbCriteria[condition] = array;
                }
              } else {
                dbCriteria[condition] = criteria[condition];
              }
            }break;
          case 'name':
            {
              if (criteria[condition].indexOf('*') === -1) {
                dbCriteria[condition] = criteria[condition];
              } else {
                const reg = /\*/g;
                const str = criteria[condition].replace(reg, '%');
                dbCriteria[condition] = { like: str };
              }
            }break;
          default:
            if (isDefault) {
              dbCriteria[condition] = criteria[condition];
            }
            break;
        }
      }
      return dbCriteria;
    };

    this.packageResOfDS = res => {
      res.status = 204;
    };

    this.retContentType = 'application/json;charset=UTF-8';
    this.defaultOffet = 0;
    this.defaultLimit = 25;
  }

  isValidQueryParams(queryConditions, isValidQueryCondition, isExpandStrValid) {
    const retData = { is: true, error: '', flag: 0, isExpand: false };

    const error = new _zError.ZError('SyntaxError', 401, 3999);
    if (isValidQueryCondition && !isValidQueryCondition(queryConditions)) {
      error.description = `query params error! the query string is : ${ _querystring2.default.stringify(queryConditions) }`;
      retData.is = false;
      retData.error = error;
      return retData;
    }

    if (!isExpandStrValid) {
      return retData;
    }

    const isExpand = this.isHasExpandAttribute(queryConditions);
    retData.isExpand = isExpand;
    if (isExpand && isExpandStrValid(queryConditions.expand) === false) {
      error.description = `query params of expand is error! expand string is: ${ queryConditions.expand }`;
      retData.is = false;
      retData.error = error;
      return retData;
    }
    return retData;
  }

  // ---- * package Response Of Create Success
  packageResOfCS(res, body) {
    res.status = 201;
    res.type = this.retContentType;
    res.body = JSON.stringify(body);
  }

  // ---- * package Response Of Retrieve Success
  packageResOfRS(res, body) {
    res.status = 200;
    res.type = this.retContentType;
    res.body = JSON.stringify(body);
  }

  // ---- * package Response Of Update Success
  packageResOfUS(res, body) {
    res.status = 200;
    res.type = this.retContentType;
    res.body = JSON.stringify(body);
  }

  // ---- * package Response Of Delete Success


  retListData(query, data, size, retFunction, href) {
    const retData = {
      offset: this.ifReturnNum(query.offset, this.defaultOffet),
      limit: this.ifReturnNum(query.limit, this.defaultLimit),
      size,
      items: []
    };
    retData.items = data.map(item => retFunction(item));
    if (href) {
      retData.href = href;
    }
    return retData;
  }
}

exports.default = new Common();