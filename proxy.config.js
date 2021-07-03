const proxy = [
  {
    context: '/api',
    target: 'https://localhost:8443/myapp',
    pathRewrite: {'^/api' : ''},
    secure: false,
    bypass: (req, res, proxyOptions) => {
      res.setHeader('Access-Control-Allow-Headers', "Content-Type");
      res.setHeader('access-control-allow-origin', "*");
      res.setHeader('Access-Control-Allow-Methods', "*");
      res.setHeader('access-control-allow-credentials', "true");
    }
  }
];
module.exports = proxy;