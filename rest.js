const path = require('path');
const { getResource, setResource } = require(path.join(__dirname, 'jgloo'));

module.exports = {
  configureResource: (app, config) => {
    const fallback = config.path.split('/').filter(Boolean).join('-');
    const resourceName = config.name || fallback;

    // List
    app.get(config.path, (req, res) => {
      const resource = getResource(resourceName) || [];
      res.json(resource);
    });

    // Read
    app.get(`${config.path}/:id`, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const model = resource.find(r => r.id === id);
      if (!model) { return res.sendStatus(404); }

      res.json(model);
    });

    // Create
    app.post(config.path, (req, res) => {
      const resource = getResource(resourceName) || [];
      const model = req.body;

      model.id = Date.now();
      resource.push(model);
      setResource(resourceName, resource);

      res.json(model);
    });

    // Update
    app.put(`${config.path}/:id`, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const index = resource.findIndex(r => r.id === id);
      if (index === -1) { return res.sendStatus(404); }

      resource[index] = req.body;
      resource[index].id = id;
      setResource(resourceName, resource);

      res.json(resource[index]);
    });

    // Patch
    app.patch(`${config.path}/:id`, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const index = resource.findIndex(r => r.id === id);
      if (index === -1) { return res.sendStatus(404); }

      resource[index] = { ...resource[index], ...req.body };
      resource[index].id = id;
      setResource(resourceName, resource);

      res.json(resource[index]);
    });

    // Delete
    app.delete(`${config.path}/:id`, (req, res) => {
      const id = Number(req.params.id);

      let resource = getResource(resourceName) || [];
      const index = resource.findIndex(r => r.id === id);
      if (index === -1) { return res.sendStatus(404); }

      resource = resource.filter(r => r.id !== id);
      setResource(resourceName, resource);

      res.json(id);
    });
  }
}