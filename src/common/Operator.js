/*
 * @Author: Zz
 * @Date: 2017-01-11 11:06:03
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-16 21:10:14
 */
const imp = {};

function convert2DBInfo(logicInfo) {
  return (imp.ResourceDBInfo ? new imp.ResourceDBInfo(logicInfo) : logicInfo);
}

function convertUpdate2DBInfo(logicInfo) {
  return (imp.ResourceUpdateDBInfo ? new imp.ResourceUpdateDBInfo(logicInfo) : logicInfo);
}

function convert2LogicInfo(dbInfo) {
  return (imp.ResourceLogicInfo ? new imp.ResourceLogicInfo(dbInfo) : dbInfo);
}

export default class Operator {
  // constructor(resourceModule, ResourceLogicInfo, ResourceDBInfo, ResourceUpdateDBInfo, convertQueryCriteria, convertCountCriteria) {
  //   imp.resourceModule = resourceModule;
  //   imp.ResourceLogicInfo = ResourceLogicInfo;
  //   imp.ResourceDBInfo = ResourceDBInfo;
  //   imp.ResourceUpdateDBInfo = ResourceUpdateDBInfo;
  //   imp.convertQueryCriteria = convertQueryCriteria;
  //   imp.convertCountCriteria = convertCountCriteria;
  // }
  async create(logicInfo) {
    try {
      const dbInfo = convert2DBInfo(logicInfo);
      const ret = await imp.resourceModule().create(dbInfo);
      return Promise.resolve(convert2LogicInfo(ret));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id, logicInfo) {
    try {
      const findInfo = await imp.resourceModule().findOne({ id });
      if (!findInfo) {
        return Promise.resolve(null);
      }
      const dbInfo = convertUpdate2DBInfo(logicInfo);
      const ret = await imp.resourceModule().update({ id }, dbInfo);
      return Promise.resolve(convert2LogicInfo(ret));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retrieve(id) {
    try {
      const ret = await imp.resourceModule().findOne({ id });
      if (!ret) {
        return Promise.resolve(null);
      }
      return Promise.resolve(convert2LogicInfo(ret));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteById(id) {
    try {
      const findInfo = await imp.resourceModule().findOne({ id });
      if (!findInfo) {
        return Promise.resolve(null);
      }
      const ret = await imp.resourceModule().destroy({ id });
      return Promise.resolve(ret);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logicDeleteById(id) {
    try {
      const ret = await imp.resourceModule().update({ id }, { deleteFlag: 1 });
      return Promise.resolve(ret);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async list(query) {
    try {
      const criteria = imp.convertQueryCriteria(query);
      const ret = await imp.resourceModule().find(criteria);
      const infoArray = ret.map(item => convert2LogicInfo(item));
      return Promise.resolve(infoArray);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async count(query) {
    try {
      const criteria = imp.convertQueryCriteria(query);
      const total = await imp.resourceModule().count(criteria);
      return Promise.resolve(total);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(method, criteria) {
    try {
      if (method === 'delete') {
        const ret = await imp.resourceModule().destroy(criteria);
        return Promise.resolve(ret);
      }
      const ret = await imp.resourceModule().update(criteria, { deleteFlag: 1 });
      return Promise.resolve(ret);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
