'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _account = require('./account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getBody = (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      const body = yield (0, _rawBody2.default)(ctx.req);
      ctx.request.body = JSON.parse(body);
    } catch (err) {
      ctx.throw(err, 400);
    }
    yield next();
  });

  return function getBody(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const router = new _koaRouter2.default();

router.post('/api/zRestKoa/accounts', getBody, _account2.default.create);

router.get('*', (() => {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    ctx.type = 'html';
    ctx.body = _fs2.default.createReadStream(`${ __dirname }/../public/index.html`);
  });

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
})());

exports.default = app => {
  app.use(router.routes()).use(router.allowedMethods());
};