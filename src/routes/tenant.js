import { verify } from 'z-error';
import { common } from '../common';
import { tenantProxy } from '../proxys';

const prp = tenantProxy;

export default {
  async create(ctx) {
    const body = ctx.request.body;
    const judge = tenantProxy.isValidData(body, true);
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
  },

  async update(ctx) {
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
  },

  async retrieve(ctx) {
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
  },

  async delete(ctx) {
    const id = ctx.params.id;
    const ret = await prp.rp.deleteById(id);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to delete resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.status = 204;
  },

  async logicDelete(ctx) {
    const id = ctx.params.id;
    const ret = await prp.rp.logicDeleteById(id);
    if (!ret) {
      const err = common.error404();
      err.description = `You can't to delete resource because the resource of url(${ctx.url}) is not exist.`;
      ctx.throw(err, 404);
      return;
    }
    ctx.status = 204;
  },

  async list(ctx) {
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
  },

  async count(ctx) {
    const total = await prp.rp.count(ctx.request.query);
    ctx.body = { total };
    ctx.status = 200;
  },

  async batchDeleteById(ctx) {
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
  },
};
