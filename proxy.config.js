const proxy = [
  {
    context: '/client',
    target: 'https://localhost:8443/myapp',
    //target: 'https://172.18.0.8:8443/myapp',
    pathRewrite: {'^/client' : ''},
    secure: false,
    bypass: (req, res, proxyOptions) => {
      res.setHeader('Access-Control-Allow-Headers', "*");
      res.setHeader('Access-Control-Allow-Origin', "*");
      res.setHeader('Access-Control-Allow-Methods', "*");
      res.setHeader('Access-Control-Allow-Credentials', "true");
    }
  },
  {
    context: '/rs',
    target: 'https://localhost:8084',
    //target: 'https://172.18.0.7:8084',
    pathRewrite: {'^/rs' : ''},
    secure: false,
    bypass: (req, res, proxyOptions) => {
      res.setHeader('Access-Control-Allow-Headers', "*");
      res.setHeader('Access-Control-Allow-Origin', "*");
      res.setHeader('Access-Control-Allow-Methods', "*");
      res.setHeader('Access-Control-Allow-Credentials', "true");
    }
  },
  {
    context: '/auth',
    target: 'https://localhost:8081/auth',
    //target: 'https://172.18.0.6:8081/auth',
    pathRewrite: {'^/auth' : ''},
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