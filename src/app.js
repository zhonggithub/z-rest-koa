/*
 * @Author: Zz 
 * @Date: 2017-01-02 16:22:01 
 * @Last Modified by: Zz
 * @Last Modified time: 2017-01-10 13:37:10
 */
import Koa from 'koa';
import koaConvert from 'koa-convert';
import koaBunyanLogger from 'koa-bunyan-logger';
import koaStaticCache from 'koa-static-cache';
import cors from 'koa2-cors';
import './env';
import routes from './routes';

const app = new Koa();

const handleError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message, code: err.code || ctx.status };
  }
};

app.use(cors())
  .use(koaConvert(koaStaticCache(`${__dirname}/public/`, {
    prefix: process.env.APP_PREFIX,
    maxAge: 100000000000,
  })))
  .use(handleError)
  .use(koaConvert(koaBunyanLogger({
    name: process.env.APP_NAME,
    level: (
      process.env.NODE_ENV === 'test'
        ? 'fatal'
        : process.env.LOG_LEVEL
    ),
  })))
  .use(koaConvert(koaBunyanLogger.requestIdContext()))
  .use(koaConvert(koaBunyanLogger.requestLogger()));

app.proxy = true;
routes(app);

export default app;

if (!module.parent) {
  app.listen(process.env.PORT);
}
