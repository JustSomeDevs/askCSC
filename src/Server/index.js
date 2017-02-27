import Koa from 'koa';

const app = new Koa();

app.use((foo) => {
  foo.body = `<h1>Hello World! This is hosted on heroku</h1>`;
});

app.listen(process.env.PORT || 3000);
