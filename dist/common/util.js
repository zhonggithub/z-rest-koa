'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @Author: Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @Date:   2016-09-27T20:03:49+08:00
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @Email:  quitjie@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @Last modified by:   Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @Last modified time: 2016-10-07T10:04:08+08:00
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */


exports.default = {
  verify(data, mandatory) {
    let msg = null;
    mandatory.some(item => {
      if (!{}.hasOwnProperty.call(data, item)) {
        const code = `INVALIDE_${ item.toUpperCase() }`;
        const message = `invalid ${ item } of ${ JSON.stringify(data) }`;
        msg = { code, message };
        return true;
      }
      return false;
    });
    return msg;
  },

  md5Encode(text) {
    const md5 = _crypto2.default.createHash('md5');
    return md5.update(text).digest('hex');
  },

  aesEncode(text, key) {
    const cipher = _crypto2.default.createCipher('aes-256-cbc', key);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  aesDecode(text, key) {
    const decipher = _crypto2.default.createDecipher('aes-256-cbc', key);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  },
  packageRet200(ctx, retData, convertDataFunc) {
    ctx.status = 200;
    ctx.body = convertDataFunc ? convertDataFunc(retData) : retData;
  },

  packageRet201(ctx, retData, convertDataFunc) {
    ctx.status = 201;
    ctx.body = convertDataFunc ? convertDataFunc(retData.data) : retData.data;
  },

  returnPage(page, defaultPage) {
    return page ? Number(page) : defaultPage || 1;
  },
  returnPageSize(pageSize, defaultPageSize) {
    return pageSize ? Number(pageSize) : defaultPageSize || 10;
  },

  exportExcelFile(ctx, exportFun, step) {
    return _asyncToGenerator(function* () {
      const query = _extends({}, ctx.request.query);
      delete query.fileName;
      const limit = query.limit;

      delete query.limit;
      const unit = step || 100;
      let rows = [];
      if (!limit || limit <= unit) {
        let pageSize;
        if (limit) {
          pageSize = Number(limit);
        } else if (query.pageSize) {
          pageSize = Number(query.pageSize);
        } else {
          pageSize = 10;
        }
        const params = _extends({}, query, {
          offset: query.offset ? Number(query.offset) : 0,
          pageSize
        });
        const data = yield exportFun(ctx, params);
        rows = data.rows;
      } else {
        const offset = query.offset ? Number(query.offset) : 0;
        let count = 0;
        for (let i = offset;; i += unit) {
          const params = _extends({}, query, {
            offset: offset + count * unit,
            pageSize: unit
          });
          let data = yield exportFun(ctx, params);
          rows = rows.concat(data.rows);
          count += 1;

          if (params.offset + unit > data.total) {
            break;
          }
          if (params.offset + unit > limit + offset) {
            if (limit - params.offset <= 0) {
              break;
            }
            data = yield exportFun(ctx, _extends({}, query, {
              offset: params.offset + 1 + unit,
              pageSize: limit - params.offset < 0 ? 0 : limit - params.offset
            }));
            rows = rows.concat(data.rows);
            break;
          }
        }
      }
      return Promise.resolve(rows);
    })();
  }
};