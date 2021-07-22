const proxy = [
  {
    context: '/api',
    target: 'https://localhost:8443/myapp',
    pathRewrite: {'^/api' : ''},
    secure: false,
    bypass: (req, res, proxyOptions) => {
      res.setHeader('Access-Control-Allow-Headers', "*");
      res.setHeader('Access-Control-Allow-Origin', "*");
      res.setHeader('Access-Control-Allow-Methods', "*");
      res.setHeader('Access-Control-Allow-Credentials', "true");
    }
  }
];
module.exports = proxy;