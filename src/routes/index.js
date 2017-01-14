import Router from 'koa-router';
import rawBody from 'raw-body';
import fs from 'fs';
import account from './account';
import tenant from './tenant';

const getBody = async (ctx, next) => {
  try {
    const body = await rawBody(ctx.req);
    ctx.request.body = JSON.parse(body);
  } catch (err) {
    ctx.throw(err, 400);
  }
  await next();
};

const router = new Router();

router.post('/api/account/:version/accounts', getBody, account.create);

// tenant
router.post('/api/account/:version/tenants', getBody, tenant.create);

router.get('*', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(`${__dirname}/../public/index.html`);
});

export default (app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
};
