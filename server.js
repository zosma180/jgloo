const { join } = require('path');
const { existsSync, readdirSync, lstatSync } = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const { configureResource } = require(join(__dirname, 'rest'));
const { getDelayMiddleware } = require(join(__dirname, 'jgloo'));
const app = express();
const params = process.argv.slice(2);
const root = join(process.cwd(), params[0]);
const port = params[1];
const staticUrl = params[2];

const apiPath = `${root}/api`;
const middlewarePath = `${root}/middlewares`;
const staticPath = `${root}/static`;

if (!existsSync(root)) {
  console.error(`The root folder "${root}" doesn't exist.`);
  process.exit(2);
}

if (!port) {
  console.error(`You must provide the port parameter.`);
  process.exit(2);
}

// Utility to deep load files
const walk = (entry, level = 1) => {
  let list = [];
  const items = readdirSync(entry);

  items.forEach(item => {
    const subEntry = join(entry, item);

    lstatSync(subEntry).isDirectory() && level < 10
      ? list = list.concat(walk(subEntry, level + 1))
      : list.push(subEntry);
  });

  return list;
};

// Config
app.use(cors());
app.use(bodyParser.json());
app.use(multer({ dest: staticPath }).any());

// Add middlewares
if (existsSync(middlewarePath)) {
  walk(middlewarePath)
    .filter(file => file.endsWith('js'))
    .forEach(file => {
      const middleware = require(file);
      app.use(middleware);
    });
}

// Add the static folder
if (existsSync(staticPath)) {
  app.use(`/${staticUrl}`, express.static(staticPath));
}

// Add API
if (!existsSync(apiPath)) {
  console.error(`No "api" folder found in the folder "${root}".`);
  process.exit(2);
}

const api = walk(apiPath)
  .filter(file => file.endsWith('js'))
  .map(file => require(file))
  .sort((a, b) => (b.priority || 0) - (a.priority || 0));

if (!api.length) {
  console.error(`No API file defined. Create one.`);
  process.exit(2);
}

api.forEach(config => {
  // Add the API delay, if it is provided
  const middleware = config.delay
    ? getDelayMiddleware(config.delay)
    : (_, __, next) => next();

  if (config.method === 'resource') {
    // ReST resource
    configureResource(app, config);
  } else {
    // Custom endpoint
    app[config.method](config.path, middleware, config.callback);
  }
});

const message = `jgloo builded on the ice shelf "${root}" and the port ${port}.`;
app.listen(port, () => console.log('\x1b[36m', message));

