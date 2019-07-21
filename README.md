# just-the-cors

> Tiny middleware to add cors support when using zeit's micro.

[![travis](https://img.shields.io/travis/com/iamnapo/just-the-cors.svg?style=for-the-badge&logo=travis&label=)](https://travis-ci.com/iamnapo/just-the-cors) [![npm](https://img.shields.io/npm/v/just-the-cors.svg?style=for-the-badge)](https://www.npmjs.com/package/just-the-cors) [![license](https://img.shields.io/github/license/iamnapo/just-the-cors.svg?style=for-the-badge)](./LICENSE)

## Install

```sh
$ npm i just-the-cors
```

## Usage

```js
const { send } = require('micro');
const { router, get } = require('microrouter');
const cors = require('just-the-cors');

const getWithCors = (path, handler) => get(path, cors(handler));

const hello = cors((req, res) => send(res, 200, `Hello ${req.params.who}`));
const hello2 = (req, res) => {
  cors(req, res);
  return send(res, 200, `Hello ${req.params.who}`);
};
const hello3 = (req, res) => send(res, 404, `Hello ${req.params.who}`);

module.exports = router(
  get('/hello/1', hello),
  get('/hello/2', hello2),
  get('/hello/3', cors(hello3)),
  getWithCors('/*', (req, res) => send(res, 200, { message: 'Hello!' })),
);
```

## License

MIT © [Napoleon-Christos Oikonomou](https://iamnapo.me)
