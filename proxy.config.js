const proxy = [
  {
    context: '/api',
    target: 'https://localhost:8443/myapp',
    pathRewrite: {'^/api' : ''},
	  secure: false
  }
];
module.exports = proxy;