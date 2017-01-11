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
 * @apiParam (input) {class} resourceProxy 操作资源的CRUD代理类
 * @apiParam (input) {function} isValidData 判断CU操作时的参数是否有效，形参为: ctx.request.body, isCreate，必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
 * @apiParam (input) {function} isExist  CU操作时判断资源唯一性，形参为ctx.request.body，必须返回一个JSON体: {'is': false, description: '', infos: []}
 * @apiParam (input) {function} retData CRU操作时封装返回客户端数据。形参为逻辑表现参的数据。
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
  async create(ctx) {
    this.a = '';
    const body = ctx.request.body;
    const judge = prp.isValidData(body, true);
    if (!judge.is) {
      common.koaErrorReturn(ctx.response, judge.error.status, judge.error);
      return;
    }
    try {
      const exist = await prp.isExist(body);
      if (exist.is) {
        const err = common.error409();
        err.description = exist.description;
        common.koaErrorReturn(ctx.response, err.status, err);
        return;
      }
      const result = await prp.rp.create(body);
      const resData = prp.retData(result);
      common.packageResOfCS(ctx.response, resData);
    } catch (err) {
      common.koaErrorReturn(ctx.response, err.status, err);
    }
  }
}
