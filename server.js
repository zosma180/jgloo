const path = require('path');
const { existsSync, readdirSync } = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { configureResource } = require(path.join(__dirname, 'rest'));
const app = express();
const params = process.argv.slice(2);
const root = params[0];
const port = params[1];

if (!existsSync(root)) {
  console.error(`The root folder "${root}" doen't exists.`);
  process.exit(2);
}

// Config
app.use(cors());
app.use(bodyParser.json());

// Add middlewares
const middlewarePath = `${root}/middlewares`;

if (existsSync(middlewarePath)) {
  readdirSync(middlewarePath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const middleware = require(path.join(middlewarePath, file));
      app.use(middleware);
    });
}

// Add the static folder
const staticPath = `${root}/static`;
if (existsSync(staticPath)) {
  app.use('/static', express.static(staticPath));
}

// Add API
const apiPath = `${root}/api`;

if (!existsSync(apiPath)) {
  console.error(`No "api" folder found in the folder "${root}".`);
  process.exit(2);
}

const api = readdirSync(apiPath)
  .filter(file => file.endsWith('.js'));

if (!api.length) {
  console.error(`No API file defined. Create one.`);
  process.exit(2);
}

api.forEach(file => {
  const config = require(path.join(apiPath, file));

  if (config.method === 'resource') {
    // ReST resource
    configureResource(app, config);
  } else {
    // Custom endpoint
    app[config.method](config.path, config.callback);
  }
});

const message = `jgloo builded on the ice shelf "${root}" and the port ${port}.`;
app.listen(port, () => console.log('\x1b[36m', message));