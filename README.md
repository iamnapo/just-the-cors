# just-the-cors

> Tiny middleware to add cors support when using zeit's micro

[![build](https://img.shields.io/github/workflow/status/iamnapo/just-the-cors/CI?style=for-the-badge&logo=github&label=)](https://github.com/iamnapo/just-the-cors/actions) [![npm](https://img.shields.io/npm/v/just-the-cors.svg?style=for-the-badge&logo=npm&label=)](https://www.npmjs.com/package/just-the-cors) [![dependencies](https://img.shields.io/david/iamnapo/just-the-cors.svg?style=for-the-badge)](./package.json) [![license](https://img.shields.io/github/license/iamnapo/just-the-cors.svg?style=for-the-badge)](./LICENSE)

## Install

```console
$ npm i just-the-cors
```

## Example

```js
const { send } = require("micro");
const { router, get } = require("microrouter");
const cors = require("just-the-cors");

const getWithCors = (path, handler) => get(path, cors(handler));

const hello = cors((req, res) => send(res, 200, { message: "Hello 1!" }));
const hello2 = (req, res) => {
	cors(req, res);
	return send(res, 200, { message: "Hello 2!" });
};
const hello3 = (req, res) => send(res, 200, { message: "Hello 3!" });

module.exports = router(
	get("/hello/1", hello),
	get("/hello/2", hello2),
	get("/hello/3", cors(hello3)),
	getWithCors("/*", (req, res) =>
		send(res, 200, { message: "Hello in general!" })
	)
);
```

### Note

> If you don't supply the `res` object as a second argument, `cors` does nothing!

```js
const { router, get } = require("microrouter");
const cors = require("just-the-cors");

const hello1 = (req) => {
	cors(req); // Does nothing!
	return "Hello 1";
};

const hello2 = (req, res) => {
	cors(req, res);
	return "Hello 2";
};

module.exports = router(
	get("/hello1", hello1), // "Access-Control-Allow-Origin": ❌
	get("/hello2", hello2) // "Access-Control-Allow-Origin": ✅
);
```
