module.exports = (...args) => {
  if (args.length === 1 && typeof args[0] === "function") {
    const cb = args[0];
    return (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      if (req.method.toUpperCase() === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.setHeader("Access-Control-Request-Headers", "Vary");
        const reqHeaders = req.headers["access-control-request-headers"];
        if (reqHeaders && reqHeaders.length) res.setHeader("Access-Control-Allow-Headers", reqHeaders);
        res.setHeader("Content-Length", "0");
        res.statusCode = 204;
        return res.end();
      }

      return cb(req, res);
    };
  }

  const [req, res = { setHeader: () => {}, end: () => {} }] = args;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method.toUpperCase() === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.setHeader("Access-Control-Request-Headers", "Vary");
    const reqHeaders = req.headers["access-control-request-headers"];
    if (reqHeaders && reqHeaders.length) res.setHeader("Access-Control-Allow-Headers", reqHeaders);
    res.setHeader("Content-Length", "0");
    res.statusCode = 204;
    return res.end();
  }

  return args;
};
