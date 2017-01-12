import Waterline from 'waterline';
import _ from 'lodash';
import fs from 'fs';

const dbOrm = {
  orm: new Waterline(),
  models: {},
  collections: {},
};

function readModel() {
  const collections = [];
  const modelsDir = `${__dirname}/../models`;
  if (fs.existsSync(modelsDir)) {
    const files = fs.readdirSync(modelsDir);
    _.each(files, (v) => {
      if (v.lastIndexOf('index.js') === -1) {
        const model = require(`${modelsDir}/${v}`);
        collections.push(model);
      }
    });
  }
  return collections;
}

const collections = readModel();
collections.forEach((item) => {
  dbOrm.orm.loadCollection(item);
});
module.exports = dbOrm;
