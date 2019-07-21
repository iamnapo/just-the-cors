import test from 'ava';
import micro from 'micro';
import listen from 'test-listen';
import got from 'got';
import { router, get } from 'microrouter';

import cors from '..';

const server = fn => listen(micro(fn));

test('different routes', async (t) => {
  const routes = router(
    get('/foo', cors(() => ({ name: 'foo' }))),
    get('/bar', cors(() => ({ name: 'bar' }))),
  );

  const url = await server(routes);
  const { body: fooGet } = await got.get(`${url}/foo`, { json: true });
  const { body: barGet } = await got.get(`${url}/bar`, { json: true });

  t.is(fooGet.name, 'foo');
  t.is(barGet.name, 'bar');
});

test('routes with params and query', async (t) => {
  const hello = req => `Hello ${req.params.msg} ${req.query.time}`;

  const routes = router(get('/hello/:msg', cors(hello)));

  const url = await server(routes);
  const { body } = await got.get(`${url}/hello/world?time=now`);

  t.is(body, 'Hello world now');
});

test('routes with underline', async (t) => {
  const routes = router(get('/foo_bar', cors(() => 'Hello with underline')));

  const url = await server(routes);
  const { body } = await got.get(`${url}/foo_bar`);

  t.is(body, 'Hello with underline');
});

test('async handlers', async (t) => {
  const hello = (req) => {
    cors(req);
    return Promise.resolve(`Hello ${req.params.msg} ${req.query.time}`);
  };

  const routes = router(get('/hello/:msg', hello));

  const url = await server(routes);
  const { body } = await got.get(`${url}/hello/world?time=now`);

  t.is(body, 'Hello world now');
});

test('composed routes', async (t) => {
  const fooRouter = cors(router(get('/foo', () => 'Hello foo')));
  const barRouter = cors(router(get('/bar', () => 'Hello bar')));

  const routes = router(fooRouter, barRouter);

  const url = await server(routes);
  const { body: fooResponse } = await got.get(`${url}/foo`);
  const { body: barResponse } = await got.get(`${url}/bar`);

  t.is(fooResponse, 'Hello foo');
  t.is(barResponse, 'Hello bar');
});

test('multiple matching routes', async (t) => {
  const withPath = cors(() => 'Hello world');
  const withParam = cors(() => t.fail('Clashing route should not have been called'));

  const routes = router(get('/path', withPath), get('/:param', withParam));

  const url = await server(routes);
  const { body } = await got.get(`${url}/path`);

  t.is(body, 'Hello world');
});

test('multiple matching async routes', async (t) => {
  const withPath = (req, res) => {
    cors(req, res);
    return micro.send(res, 200, 'Hello world');
  };
  const withParam = cors(() => t.fail('Clashing route should not have been called'));

  const routes = router(get('/path', withPath), get('/:param', withParam));

  const url = await server(routes);
  const { body } = await got.get(`${url}/path`);

  t.is(body, 'Hello world');
});

test('works with cors', async (t) => {
  const routesBefore = router(get('/', () => ({ ok: true })));
  const routesAfter = router(get('/', cors(() => ({ ok: true }))));

  const urlBefore = await server(routesBefore);
  const urlAfter = await server(routesAfter);
  const { body: bodyBefore, headers: headersBefore } = await got.get(`${urlBefore}/`, { json: true });
  const { body: bodyAfter, headers: headersAfter } = await got.get(`${urlAfter}/`, { json: true });

  t.true(bodyBefore.ok);
  t.true(bodyAfter.ok);
  t.true(!Object.prototype.hasOwnProperty.call(headersBefore, 'access-control-allow-origin'));
  t.true(Object.prototype.hasOwnProperty.call(headersAfter, 'access-control-allow-origin'));
  t.is(headersAfter['access-control-allow-origin'], '*');
});
