require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
// express框架用于处理表单数据
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var admin = express.Router()
var authority = express.Router()
var root = express.Router()
var dataJson = require('../mockData.json')
var mockData = {}

function mock (keyname, model) {
  var num = Math.ceil(Math.random() * 1000)
  var temp = []
  for (var i = 0 ; i <= num; i++) {
    temp.push(model)
  }
  mockData[keyname] = temp
}

function handData (data, page) {
  var resource = {
    content: data.slice((page.pageNo - 1) * page.pageSize, page.pageNo * page.pageSize),
    number:  parseInt(page.pageNo - 1),
    size: parseInt(page.pageSize),
    numberOfElements:  data.length,
    totalPages: Math.ceil(data.length/page.pageSize),
    totalElements: data.length,
    first: (page.pageNo == 1 || Math.ceil(data.length/page.pageSize) == 1)?true:false,
    last: (page.pageNo == Math.ceil(data.length/page.pageSize))?true:false
  }
  return resource
}
/**
 * 登录
 */
authority.post('/login', function(req, res, next) {
  var result = {}
  if (req.body.validate == 'd6kvp') {
    if (req.body.identifier == '123') {
      if (req.body.password == 'e10adc3949ba59abbe56e057f20f883e') {
        mockData['USER'] = {
          id: '10000000000',
          username: req.body.identifier,
          lastLogin: new Date().getTime()
        }
        result = {
          responseCode: '200',
          message: '登录成功'
        }
      } else {
        result = {
          responseCode: '400',
          message: '密码错误'
        }
      }
    } else {
      result = {
        responseCode: '400',
        message: '账号不存在'
      }
    }
  } else {
    result = {
      responseCode: '400',
      message: '验证码错误'
    }
  }
  res.json(result)
})

/**
 * 获取登录信息
 */
authority.get('/admin', function(req, res, next) {
  var result = {}
  if (mockData['USER'] && mockData['USER'].id) {
    result = {
      responseCode: '200',
      resultParm: {
        resource: mockData['USER']
      }
    }
  } else {
    result = {
      responseCode: '401',
      message: '请先登录'
    }
  }
  res.json(result)
})

admin.get('/carousel', function(req, res, next) {
    var model = dataJson.carouselModel
    if (!mockData.carousel) {
      mock('carousel', model)
    }
    var page = {
      pageNo: req.query.pageNo || req.params.pageNo,
      pageSize: req.query.pageSize || req.params.pageSize
    }
    res.json({
      responseCode: '200',
      resultParm: {
        resource: handData(mockData.carousel, page)
      }
    })
});

/**
 * 查看图片
 */
var fs = require('fs')
root.get('/file/see', function(req, res, next) {
  //设置请求的返回头type,content的type类型列表见上面
  res.setHeader("Content-Type", "image/png");
  //格式必须为 binary 否则会出错
  var content =  fs.readFileSync(path.resolve(__dirname, '../static/img/logo.png'), "binary");
  res.writeHead(200, "Ok");
  res.write(content,"binary"); //格式必须为 binary，否则会出错
  res.end();
});

root.get('/validate.jpg', function(req, res, next) {
  //设置请求的返回头type,content的type类型列表见上面
  res.setHeader("Content-Type", "image/png");
  //格式必须为 binary 否则会出错
  var content =  fs.readFileSync(path.resolve(__dirname, '../static/img/validate.jpg'), "binary");
  res.writeHead(200, "Ok");
  res.write(content,"binary"); //格式必须为 binary，否则会出错
  res.end();
})

app.use('/authority', authority)
app.use('/admin', admin)
app.use(root)
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port + '/admin/index.html'

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
