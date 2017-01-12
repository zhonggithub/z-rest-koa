'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zError = require('z-error');

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let prp = {};

function isExist() {
  return { is: false, description: '', infos: [] };
}

function retData(data) {
  return data;
}

function retListData(query, result, total) {
  return {
    items: result,
    query,
    total
  };
}

function defaultFunc() {
  return { is: true, error: '', flag: 0, isExpand: false };
}

class Controller {
  /**
   * @apiDescription  构造函数
   * @apiVersion 0.0.1
   *
   * @apiGroup ZController
   * @apiParam (input) {class} resourceProxy 操作资源的CRUD代理类对象
   * @apiParam (input) {function} isValidData 判断C操作时的参数是否有效，形参为: ctx.request.body 必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
   * @apiParam (input) {function} isValidUpateData 判断U操作时参数的有效性，形参为: ctx.request.body，必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
   * @apiParam (input) {function} isExist  CU操作时判断资源唯一性，形参为ctx.request.body，必须返回一个JSON体: {'is': false, description: '', infos: []}
   * @apiParam (input) {function} retData CRU操作时封装返回客户端数据。形参为DB层数据格式，返回值为逻辑表现参的数据。
   * @apiParam (input) {function} retListData list操作时封装返回客户端的数据。形参为: ctx.request.query，满足条件的逻辑表现层数据items,满足条件在数据库的总条数total。
   * @apiParam (input) {function} isValidQueryParams list，R 操作判断ctx.request.query的有效性。
   * @apiParam (input) {function} isExpandValid 判断ctx.request.query中expand字段的有效性
   */
  constructor(opts) {
    prp = new Proxy(opts, {
      get: (target, property) => {
        if (property in target) {
          if (!target[property] && property === 'isExist') {
            return isExist;
          }

          if (!target[property] && property === 'retData') {
            return retData;
          }

          if (!target[property] && property === 'retListData') {
            return retListData;
          }

          if (!target[property]) {
            return defaultFunc;
          }
          return target[property];
        }
        throw new ReferenceError(`Property: ${ property } does not exist.`);
      }
    });
  }

  create(ctx) {
    return _asyncToGenerator(function* () {
      const body = ctx.request.body;
      const judge = prp.isValidData(body, true);
      if (!judge.is) {
        ctx.throw(judge.error, 422);
        return;
      }
      const exist = yield prp.isExist(body);
      if (exist.is) {
        const err = _common2.default.error409();
        err.description = exist.description;
        ctx.throw(err, 409);
        return;
      }
      const result = yield prp.resourceProxy.create(body);
      const resData = prp.retData(result);
      ctx.body = resData;
      ctx.status = 201;
    })();
  }

  update(ctx) {
    return _asyncToGenerator(function* () {
      const body = ctx.query.body;
      const judge = prp.isValidUpateData(body);
      if (!judge.is) {
        ctx.throw(judge.error, 422);
        return;
      }
      const id = ctx.params.id;
      const ret = yield prp.rp.update(id, body);
      if (!ret) {
        const err = _common2.default.error404();
        err.description = `You can't to update resource because the resource of url(${ ctx.url }) is not exist.`;
        ctx.throw(err, 404);
        return;
      }
      ctx.body = prp.retData(ret);
      ctx.status = 200;
    })();
  }

  retrieve(ctx) {
    return _asyncToGenerator(function* () {
      const judge = _common2.default.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, null);
      if (!judge.is) {
        ctx.throw(judge.error, 422);
        return;
      }
      const id = ctx.params.id;
      const ret = yield prp.rp.retrieve(id);
      if (!ret) {
        const err = _common2.default.error404();
        err.description = `You can't to retrieve resource because the resource of url(${ ctx.url }) is not exist.`;
        ctx.throw(err, 404);
        return;
      }
      ctx.body = prp.retData(ret);
      ctx.status = 200;
    })();
  }

  delete(ctx) {
    return _asyncToGenerator(function* () {
      const id = ctx.params.id;
      const ret = yield prp.rp.deleteById(id);
      if (!ret) {
        const err = _common2.default.error404();
        err.description = `You can't to delete resource because the resource of url(${ ctx.url }) is not exist.`;
        ctx.throw(err, 404);
        return;
      }
      ctx.status = 204;
    })();
  }

  logicDelete(ctx) {
    return _asyncToGenerator(function* () {
      const id = ctx.params.id;
      const ret = yield prp.rp.logicDeleteById(id);
      if (!ret) {
        const err = _common2.default.error404();
        err.description = `You can't to delete resource because the resource of url(${ ctx.url }) is not exist.`;
        ctx.throw(err, 404);
        return;
      }
      ctx.status = 204;
    })();
  }

  list(ctx) {
    return _asyncToGenerator(function* () {
      const judge = _common2.default.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, prp.isExpandValid);
      if (!judge.is) {
        ctx.throw(judge.error, 422);
        return;
      }
      ctx.request.query.offset = _common2.default.ifReturnNum(ctx.request.query.offset, 0);
      ctx.request.query.limit = _common2.default.ifReturnNum(ctx.request.query.limit, 25);
      const result = yield prp.rp.list(ctx.request.query);
      const total = yield prp.rp.count(ctx.request.query);
      ctx.body = prp.retListData(ctx.request.query, result, total);
      ctx.status = 200;
    })();
  }

  count(ctx) {
    return _asyncToGenerator(function* () {
      const total = yield prp.rp.count(ctx.request.query);
      ctx.body = { total };
      ctx.status = 200;
    })();
  }

  batchDeleteById(ctx) {
    return _asyncToGenerator(function* () {
      const body = ctx.request.body;
      let error = (0, _zError.verify)(body, ['method', 'bizContent']);
      if (error) {
        ctx.throw(error, 422);
        return;
      }
      error = (0, _zError.verify)(body.bizContent, ['items']);
      if (error) {
        ctx.throw(error, 422);
        return;
      }
      yield prp.rp.delete(body.method, { id: body.bizContent.items });
      ctx.status = 204;
    })();
  }
}
exports.default = Controller;