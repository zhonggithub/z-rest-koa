'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaBunyanLogger = require('koa-bunyan-logger');

var _koaBunyanLogger2 = _interopRequireDefault(_koaBunyanLogger);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koa2Cors = require('koa2-cors');

var _koa2Cors2 = _interopRequireDefault(_koa2Cors);

require('./env');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _common = require('./common');

var _dbConfig = require('./dbConfig');

var _dbConfig2 = _interopRequireDefault(_dbConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Author: Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Date: 2017-01-02 16:22:01
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Last Modified by: Zz
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Last Modified time: 2017-01-12 11:47:14
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


const app = new _koa2.default();

const errorHandler = (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { code: err.code, message: err.message, description: err.description };
    }
  });

  return function errorHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const successHandler = (() => {
  var _ref2 = _asyncToGenerator(function* (ctx, next) {
    yield next();
    ctx.response.set('X-Server-Request-Id', ctx.reqId);
    if (!ctx.status || ctx.status >= 200 && ctx.status < 400) {
      if (ctx.formatBody !== false) {
        ctx.body = {
          code: 0,
          message: 'success',
          data: ctx.body
        };
      }
    }
  });

  return function successHandler(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

app.use((0, _koa2Cors2.default)()).use((0, _koaConvert2.default)((0, _koaStaticCache2.default)(`${ __dirname }/public/`, {
  prefix: process.env.APP_PREFIX,
  maxAge: 100000000000
}))).use(successHandler).use(errorHandler).use((0, _koaConvert2.default)((0, _koaBunyanLogger2.default)({
  name: process.env.APP_NAME,
  level: process.env.NODE_ENV === 'test' ? 'fatal' : process.env.LOG_LEVEL
}))).use((0, _koaConvert2.default)(_koaBunyanLogger2.default.requestIdContext())).use((0, _koaConvert2.default)(_koaBunyanLogger2.default.requestLogger()));

app.proxy = true;
(0, _routes2.default)(app);

exports.default = app;


if (!module.parent) {
  _common.dbOrm.orm.initialize(_dbConfig2.default, (err, models) => {
    if (err) {
      throw err;
    }
    _common.dbOrm.models = models;
    _common.dbOrm.collections = models.collections;
    app.listen(process.env.PORT);
    console.log(`listen: ${ process.env.PORT }`);
  });
}