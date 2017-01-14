/*
 * @Author: Zz
 * @Date: 2017-01-14 20:22:00
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-14 22:42:32
 */
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

/**
 * @apiDescription  构造函数
 * @apiVersion 0.0.1
 *
 * @apiGroup Controller
 * @apiParam (input) {class} resourceProxy 操作资源的CRUD代理类对象
 * @apiParam (input) {function} isValidData 判断C操作时的参数是否有效，形参为: ctx.request.body 必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
 * @apiParam (input) {function} isValidUpateData 判断U操作时参数的有效性，形参为: ctx.request.body，必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
 * @apiParam (input) {function} isExist  CU操作时判断资源唯一性，形参为ctx.request.body，必须返回一个JSON体: {'is': false, description: '', infos: []}
 * @apiParam (input) {function} retData CRU操作时封装返回客户端数据。形参为DB层数据格式，返回值为逻辑表现参的数据。
 * @apiParam (input) {function} retListData list操作时封装返回客户端的数据。形参为: ctx.request.query，满足条件的逻辑表现层数据items,满足条件在数据库的总条数total。
 * @apiParam (input) {function} isValidQueryParams list，R 操作判断ctx.request.query的有效性。
 * @apiParam (input) {function} isExpandValid 判断ctx.request.query中expand字段的有效性
 */
module.exports = opts => new Proxy(opts, {
  get: (target, property) => {
    if (property in target) {
      if (property === 'isExist') {
        return target[property] || isExist;
      }

      if (property === 'retData') {
        return target[property] || retData;
      }

      if (property === 'retListData') {
        return target[property] || retListData;
      }
      return target[property] || defaultFunc;
    }
    return undefined;
    // throw new ReferenceError(`Property: ${property} does not exist.`);
  },
});

// module.exports = opts => new Proxy(opts, {
//   get: (target, property) => {
//     if (property === 'isExist') {
//       return target[property] || isExist;
//     }
//     if (property === 'retData') {
//       return target[property] || retData;
//     }
//     if (property === 'retListData') {
//       return target[property] || retListData;
//     }
//     return target[property] || defaultFunc;
//   },
// });
