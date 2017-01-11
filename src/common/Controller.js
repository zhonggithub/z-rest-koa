import { verify } from 'z-error';
import common from './common';

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
    total,
  };
}

function defaultFunc() {
  return { is: true, error: '', flag: 0, isExpand: false };
}

export default class Controller {
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
        throw new ReferenceError(`Property: ${property} does not exist.`);
      },
    });
  }

  static async create(ctx) {
    const body = ctx.request.body;
    const judge = prp.isValidData(body, true);
    if (!judge.is) {
      ctx.throw(judge.error, 422);
      return;
    }
    const exist = await prp.isExist(body);
    if (exist.is) {
      const err = common.error409();
      err.description = exist.description;
      ctx.throw(err, 409);
      return;
    }
    const result = await prp.resourceProxy.create(body);
    const resData = prp.retData(result);
    ctx.body = resData;
    ctx.status = 201;
  }

  static async update(ctx) {
    const body = ctx.query.body;
    const judge = prp.isValidUpateData(body);
    if (!judge.is) {
      ctx.throw(judge.error, 422);
      return;
    }
    const id = ctx.params.id;
    const ret = await prp.rp.update(id, body);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to update resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.body = prp.retData(ret);
    ctx.status = 200;
  }

  static async retrieve(ctx) {
    const judge = common.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, null);
    if (!judge.is) {
      ctx.throw(judge.error, 422);
      return;
    }
    const id = ctx.params.id;
    const ret = await prp.rp.retrieve(id);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to retrieve resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.body = prp.retData(ret);
    ctx.status = 200;
  }

  static async delete(ctx) {
    const id = ctx.params.id;
    const ret = await prp.rp.deleteById(id);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to delete resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.status = 204;
  }

  static async logicDelete(ctx) {
    const id = ctx.params.id;
    const ret = await prp.rp.logicDeleteById(id);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to delete resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.status = 204;
  }

  static async list(ctx) {
    const judge = common.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, prp.isExpandValid);
    if (!judge.is) {
      ctx.throw(judge.error, 422);
      return;
    }
    ctx.request.query.offset = common.ifReturnNum(ctx.request.query.offset, 0);
    ctx.request.query.limit = common.ifReturnNum(ctx.request.query.limit, 25);
    const result = await prp.rp.list(ctx.request.query);
    const total = await prp.rp.count(ctx.request.query);
    ctx.body = prp.retListData(ctx.request.query, result, total);
    ctx.status = 200;
  }

  static async count(ctx) {
    const total = await prp.rp.count(ctx.request.query);
    ctx.body = { total };
    ctx.status = 200;
  }

  static async batchDeleteById(ctx) {
    const body = ctx.request.body;
    let error = verify(body, ['method', 'bizContent']);
    if (error) {
      ctx.throw(error, 422);
      return;
    }
    error = verify(body.bizContent, ['items']);
    if (error) {
      ctx.throw(error, 422);
      return;
    }
    await prp.rp.delete(body.method, { id: body.bizContent.items });
    ctx.status = 204;
  }
}
