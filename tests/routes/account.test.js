import test from 'ava';
import fetchMock from 'fetch-mock';
import request from '../helpers/request';
import { dbOrm } from '../../src/common';

test.afterEach.always(() => {
  fetchMock.restore();
});

const mockAccount = {
  name: `${Math.random()}00000000`,
  account: `${Math.random()}1210`,
  password: '2536',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// let account = null;
test.before(async () => {
  while (!dbOrm.models.collections) {
    await sleep(1000);
  }
  return Promise.resolve({});
});

test.serial('POST /api/account/v1/accounts ok', async (t) => {
  const res = await request.post('/api/account/v1/accounts').send(mockAccount);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  // console.log(res.body);
});
