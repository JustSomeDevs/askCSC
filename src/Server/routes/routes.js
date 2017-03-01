/**
 * routes.js holds our routes
 * @author Albert Hermida
 * NOTE: Handler functions for enpoints must share client code
 */
import fs from 'fs'; //filesystem used for serving templates
import fetch from 'isomorphic-fetch'; //koa request wrapper for oembed

//Route object
const routes = {};

//Escape Content in JSON
function encodeHTML(str) {
  return Array.prototype.map.call(str, (c) => {
    return ['&#', c.charCodeAt(), ';'].join('');
  }).join('');
}

//Render bakes content & data into HTML template
function render(content, data) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../src/assets/templates/index.html`,
      {'encoding': 'utf8'}, (err, layout) => {
        if (err) reject(err);
        const html = layout.replace('{{{body}}}', content).replace('{{{data}}}', encodeHTML(JSON.stringify(data)));
        resolve(html);
    });
  });
}

//handle '/' route
routes.handleFP = async (ctx) => {

  //do client calls and resolve our promise
  //const content = await ssr('group', ['/a/', 0], ctx);
  //
  const content = {
    html: `<h1>Hello World</h1>`,
    state: {
      'example': 'state',
    },
  };

  ctx.body = await render(content.html, content.state);
};

// handle '/upload' route
routes.handleUpload = async (ctx) => {

  ctx.body = 'yo';
};

export default routes;
