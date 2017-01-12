'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/*
 * @Author: Zz
 * @Date: 2017-01-11 11:06:03
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-12 15:03:11
 */
const imp = {};

function convert2DBInfo(logicInfo) {
  return imp.ResourceDBInfo ? new imp.ResourceDBInfo(logicInfo) : logicInfo;
}

function convertUpdate2DBInfo(logicInfo) {
  return imp.ResourceUpdateDBInfo ? new imp.ResourceUpdateDBInfo(logicInfo) : logicInfo;
}

function convert2LogicInfo(dbInfo) {
  return imp.ResourceLogicInfo ? new imp.ResourceLogicInfo(dbInfo) : dbInfo;
}

class Operator {
  constructor(resourceModule, ResourceLogicInfo, ResourceDBInfo, ResourceUpdateDBInfo, convertQueryCriteria, convertCountCriteria) {
    imp.resourceModule = resourceModule;
    imp.ResourceLogicInfo = ResourceLogicInfo;
    imp.ResourceDBInfo = ResourceDBInfo;
    imp.ResourceUpdateDBInfo = ResourceUpdateDBInfo;
    imp.convertQueryCriteria = convertQueryCriteria;
    imp.convertCountCriteria = convertCountCriteria;
  }
  create(logicInfo) {
    return _asyncToGenerator(function* () {
      try {
        const dbInfo = convert2DBInfo(logicInfo);
        const ret = yield imp.resourceModule().create(dbInfo);
        return Promise.resolve(convert2LogicInfo(ret));
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  update(id, logicInfo) {
    return _asyncToGenerator(function* () {
      try {
        const findInfo = yield imp.resourceModule().findOne({ id });
        if (!findInfo) {
          return Promise.resolve(null);
        }
        const dbInfo = convertUpdate2DBInfo(logicInfo);
        const ret = yield imp.resourceModule().update({ id }, dbInfo);
        return Promise.resolve(convert2LogicInfo(ret));
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  retrieve(id) {
    return _asyncToGenerator(function* () {
      try {
        const ret = yield imp.resourceModule().findOne({ id });
        if (!ret) {
          return Promise.resolve(null);
        }
        return Promise.resolve(convert2LogicInfo(ret));
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  deleteById(id) {
    return _asyncToGenerator(function* () {
      try {
        const findInfo = yield imp.resourceModule().findOne({ id });
        if (!findInfo) {
          return Promise.resolve(null);
        }
        const ret = yield imp.resourceModule().destroy({ id });
        return Promise.resolve(ret);
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  logicDeleteById(id) {
    return _asyncToGenerator(function* () {
      try {
        const ret = yield imp.resourceModule().update({ id }, { deleteTag: 1 });
        return Promise.resolve(ret);
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  list(query) {
    return _asyncToGenerator(function* () {
      try {
        const criteria = imp.convertQueryCriteria(query);
        const ret = yield imp.resourceModule().find(criteria);
        const infoArray = ret.map(function (item) {
          return convert2LogicInfo(item);
        });
        return Promise.resolve(infoArray);
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  count(query) {
    return _asyncToGenerator(function* () {
      try {
        const criteria = imp.convertQueryCriteria(query);
        const total = yield imp.resourceModule().count(criteria);
        return Promise.resolve(total);
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }

  delete(method, criteria) {
    return _asyncToGenerator(function* () {
      try {
        if (method === 'delete') {
          const ret = yield imp.resourceModule().destroy(criteria);
          return Promise.resolve(ret);
        }
        const ret = yield imp.resourceModule().update(criteria, { deleteTag: 1 });
        return Promise.resolve(ret);
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }
}
exports.default = Operator;