import Waterline from 'waterline';
import _ from 'lodash';
import fs from 'fs';

module.exports = {
  orm: new Waterline(),
  models: {},
  collections: {},
  readModel: () => {
    const collections = [];
    const modelsDir = './../models';
    if (fs.existsSync()) {
      const files = fs.readdirSync(modelsDir);
      _.each(files, (v) => {
        if (v.lastIndexOf('index.js') === -1) {
          const model = require(`${modelsDir}/${v}`);
          collections.push(model);
        }
      });
    }
    return collections;
  },
};
