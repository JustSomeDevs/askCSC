/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_send__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_send___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_send__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa_route__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa_route___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_koa_route__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_routes_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_mount__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_mount___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_mount__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa_bodyparser__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa_bodyparser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_koa_bodyparser__);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Server.js
 * -- Server class --> Responds to requests for Client Side Routes
 */
 // kinda like flask/express, a little simpler
 // serve static routes -- /static in our case
 // small router by koas
 // handler functions for routes
 // allows us to mount paths
 // easy access to json body

class Server {

  // initialize Routes and Server
  constructor(options) {
    var _this = this;

    // setup server
    const server = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
    this.server = server;

    // passed in -- option from config.js
    this.port = options.port;

    // keep track of active requests
    this.activeRequests = 0;

    // log requests & track active -- middleware
    server.use((() => {
      var _ref = _asyncToGenerator(function* (ctx, next) {
        const start = new Date();
        _this.activeRequests++;
        yield next();
        const ms = new Date() - start;
        _this.activeRequests--;
        console.log(`${ctx.method} '${ctx.url}' -- ${ms} ms`);
        if (!options.test) {
          process.send({ 'cmd': 'notifyRequest' });
        }
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })());

    // set up body parser for easy-access to json
    server.use(__WEBPACK_IMPORTED_MODULE_5_koa_bodyparser___default()({ formLimit: '4mb' }));

    // make static folder static
    server.use(__WEBPACK_IMPORTED_MODULE_4_koa_mount___default()('/assets', (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        yield __WEBPACK_IMPORTED_MODULE_1_koa_send___default()(ctx, ctx.path, {
          root: `${__dirname}/../src/assets`
        });
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })()));

    // handle front page view -- proxy for /random/ until we (I) get some metric for rating -- switches on page 1
    server.use(__WEBPACK_IMPORTED_MODULE_2_koa_route___default.a.get('/', __WEBPACK_IMPORTED_MODULE_3__routes_routes_js__["a" /* default */].handleFP));
  }

  // log number of active requests
  logRequests() {
    console.log(`Active Requests: ${this.activeRequests}`);
  }

  // start server
  start() {
    this.server.listen(this.port);
  }
}

/* harmony default export */ __webpack_exports__["a"] = Server;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_os__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_os___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_os__);
/**
 * config.js is a configuration file for the server
 * Holds Port & numCPUs
 */


const config = {
  port: process.env.PORT || '8080',
  numCPUs: process.env.PROCESSES || __WEBPACK_IMPORTED_MODULE_0_os___default.a.cpus().length,
  test: false
};

/* harmony default export */ __webpack_exports__["a"] = config;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * routes.js holds our routes
 * @author Albert Hermida
 * NOTE: Handler functions for enpoints must share client code
 */
 //filesystem used for serving templates
 //koa request wrapper for oembed

//Route object
const routes = {};

//Escape Content in JSON
function encodeHTML(str) {
  return Array.prototype.map.call(str, c => {
    return ['&#', c.charCodeAt(), ';'].join('');
  }).join('');
}

//Render bakes content & data into HTML template
function render(content, data) {
  return new Promise((resolve, reject) => {
    __WEBPACK_IMPORTED_MODULE_0_fs___default.a.readFile(`${__dirname}/../src/assets/templates/index.html`, { 'encoding': 'utf8' }, (err, layout) => {
      if (err) reject(err);
      console.log(layout);
      const html = layout.replace('{{{body}}}', content).replace('{{{data}}}', encodeHTML(JSON.stringify(data)));
      resolve(html);
    });
  });
}

//handle '/' route
routes.handleFP = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {

    //do client calls and resolve our promise
    //const content = await ssr('group', ['/a/', 0], ctx);
    //
    const content = {
      html: `<h1>Hello World</h1>`,
      state: {
        'example': 'state'
      }
    };

    ctx.body = yield render(content.html, content.state);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

// handle '/upload' route
routes.handleUpload = (() => {
  var _ref2 = _asyncToGenerator(function* (ctx) {

    // s3 stuff goes here
    console.log('I am s3');
    ctx.body = 'yo';
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})();

// handle post to '/oembed' -- really just a solution to cors
routes.handleEmbed = (() => {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    let body = ctx.request.body;
    let url = body.url;

    //here check for oembed routes
    if (ctx.body) {
      var options = {
        url: url,
        method: "GET"
      };
      //real hacky
      let response = yield __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default()(options);
      let text = yield response.text();
      ctx.body = text;
    } else {

      //reject
    }
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})();

/* harmony default export */ __webpack_exports__["a"] = routes;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("koa-mount");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("koa-route");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("koa-send");

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Server_Server_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cluster__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cluster___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_cluster__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_readline__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_readline___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_readline__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_os__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_os___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_os__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dns__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dns___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_dns__);
/**
 *  askcsc server.js -- serves html (with shared client-server code)
 *  @author Albert Hermida
 *  - es6/7 modules "use strict"; by default
 */







// Determine if development flag was called
const dev = process.argv.includes('dev');

// Creates new servers
function runServer(options) {
  const server = new __WEBPACK_IMPORTED_MODULE_0__Server_Server_js__["a" /* default */](options);
  server.start();
  return server;
}

// Metadata about process
const meta = {};
meta.failedInstances = 0;
meta.requestsServed = 0;
meta.numCPUs = __WEBPACK_IMPORTED_MODULE_1__config_js__["a" /* default */].numCPUs;

// Log Error & Stats on uncaught exception
process.on('uncaughtException', err => {
  console.error('Caught exception', err, err.stack);
  console.error(`\nFailed with: ${meta.failedInstances} failed instances`);

  // fail --> exit
  process.exit();
});

/**
 *  Manage Clusters
 */
if (__WEBPACK_IMPORTED_MODULE_2_cluster___default.a.isMaster) {

  // All processes
  const processes = [];

  // Set Master Cluster -- Important to note -- cluster.settings
  __WEBPACK_IMPORTED_MODULE_2_cluster___default.a.setupMaster();

  // spin up new clusters proportional to numCPUs -->
  for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_1__config_js__["a" /* default */].numCPUs; i++) {
    let fork = __WEBPACK_IMPORTED_MODULE_2_cluster___default.a.fork();

    // push process id into processes
    processes.push(fork.process.pid);
  }

  // Log Requests From Cluster
  __WEBPACK_IMPORTED_MODULE_2_cluster___default.a.on('message', msg => {
    if (msg.cmd && msg.cmd == 'notifyRequest') {
      meta.requestsServed++;
    }
  });

  /**
   *  Handle Worker Failure
   *  Can only happen 30 times to mitigate real bugs.
   */
  __WEBPACK_IMPORTED_MODULE_2_cluster___default.a.on('exit', worker => {
    if (meta.failedProcesses < 30) {

      // if worker fails -- restart new one & log dead one
      console.log(`Worker pid: ${worker.process.pid} failed -- restarting.`);

      // delete old process
      delete processes[processes.indexOf(worker.process.pid)];

      // spin up the new one & add to failed number
      const fork = __WEBPACK_IMPORTED_MODULE_2_cluster___default.a.fork();

      // push process id into processes
      processes.push(fork.process.pid);

      // keep count of how many fails
      meta.failedProcesses++;
    } else {

      // Quit if there are over 30 process failures
      console.log('30 workers failed, shutting down');
      process.exit();
    }
  });

  // timestamp
  const date = new Date();

  // get hour
  const hr = date.getHours() % 12;
  const hour = [`${hr === 0 ? 12 : hr}:`, `${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`, `${date.getHours() <= 12 ? 'AM' : 'PM'}`].join('');

  const startedAt = [`Server started at ${hour} on:`, ` ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`].join('');

  // Log start
  console.log(startedAt);

  // if we're in our dev environment, start it up
  if (dev) {

    // create prompt
    console.log('You can type: "exit" or "quit" to shut down the app.');
    console.log('Type: "stats" to get info about the server.');

    // set up user interface
    const rl = __WEBPACK_IMPORTED_MODULE_3_readline___default.a.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let getLine = () => {
      rl.question('Command: ', answer => {
        if (answer == 'exit' || answer == 'quit') {
          process.exit(0);
        }
        if (answer == 'stats') {

          // Log metadata
          console.log(`CPU cores: ${meta.numCPUs}`);
          console.log(`Requests served: ${meta.requestsServed}`);
          console.log(`Failed instances: ${meta.failedInstances}`);

          // Log Processes
          console.log(`Master ID: ${process.pid}`);
          console.log(`Worker IDs: ${processes.join(',')}`);
        }
        getLine('Command:');
      });
    };

    // Log IP
    __WEBPACK_IMPORTED_MODULE_5_dns___default.a.lookup(__WEBPACK_IMPORTED_MODULE_4_os___default.a.hostname(), (err, address) => {
      console.log(`IP Address: ${address}`);

      // start up command line loop
      getLine();
    });
  } else {
    console.log('\nType CTRL-c to exit');
  }
} else {

  /**
   * Spin up new Server if not cluster master
   * called from that nifty class we wrote, will create a Koa server in the
   * cluster for every core that we have.
   */
  runServer(__WEBPACK_IMPORTED_MODULE_1__config_js__["a" /* default */]);
}

/***/ })
/******/ ]);