'use strict';

var _waterline = require('waterline');

var _waterline2 = _interopRequireDefault(_waterline);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dbOrm = {
  orm: new _waterline2.default(),
  models: {},
  collections: {}
};

function readModel() {
  const collections = [];
  const modelsDir = `${ __dirname }/../models`;
  if (_fs2.default.existsSync(modelsDir)) {
    const files = _fs2.default.readdirSync(modelsDir);
    _lodash2.default.each(files, v => {
      if (v.lastIndexOf('index.js') === -1) {
        const model = require(`${ modelsDir }/${ v }`);
        collections.push(model);
      }
    });
  }
  return collections;
}

const collections = readModel();
collections.forEach(item => {
  dbOrm.orm.loadCollection(item);
});
module.exports = dbOrm;