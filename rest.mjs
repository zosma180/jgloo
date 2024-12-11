import path from 'path';
import { getResource, setResource } from './jgloo.mjs';

export const configureResource = (app, config, middleware) => {
  const fallback = config.path.split('/').filter(Boolean).join('-');
  const resourceName = config.name || fallback;
  const skips = config.not || [];

  // List
  if (skips.includes('LIST') === false) {
    app.get(config.path, middleware, (req, res) => {
      const resource = getResource(resourceName) || [];
      res.json(resource);
    });
  }

  // Read
  if (skips.includes('READ') === false) {
    app.get(`${config.path}/:id`, middleware, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const model = resource.find(r => r.id === id);
      if (!model) { return res.sendStatus(404); }

      res.json(model);
    });
  }

  // Create
  if (skips.includes('CREATE') === false) {
    app.post(config.path, middleware, (req, res) => {
      const resource = getResource(resourceName) || [];
      const model = req.body;

      model.id = Date.now();
      resource.push(model);
      setResource(resourceName, resource);

      res.json(model);
    });
  }

  // Update
  if (skips.includes('UPDATE') === false) {
    app.put(`${config.path}/:id`, middleware, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const index = resource.findIndex(r => r.id === id);
      if (index === -1) { return res.sendStatus(404); }

      resource[index] = req.body;
      resource[index].id = id;
      setResource(resourceName, resource);

      res.json(resource[index]);
    });
  }

  // Patch
  if (skips.includes('PATCH') === false) {
    app.patch(`${config.path}/:id`, middleware, (req, res) => {
      const id = Number(req.params.id);

      const resource = getResource(resourceName) || [];
      const index = resource.findIndex(r => r.id === id);
      if (index === -1) { return res.sendStatus(404); }

      resource[index] = { ...resource[index], ...req.body };
      resource[index].id = id;
      setResource(resourceName, resource);

      res.json(resource[index]);
    });
  }

  // Delete
  if (skips.includes('DELETE') === false) {
    app.delete(`${config.path}/:id`, middleware, (req, res) => {
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