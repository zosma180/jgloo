<p align="center"><img src="logo.png" alt="jgloo logo" height="120"></p>

# jgloo

![npm](https://img.shields.io/npm/v/jgloo?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/jgloo?style=flat-square)
![license](https://img.shields.io/npm/l/jgloo?style=flat-square)
[![Issues](https://img.shields.io/github/issues/zosma180/jgloo.svg?style=flat-square)](https://github.com/zosma180/jgloo/issues)

---

## Description
**jgloo** is a local HTTP server useful to mock your backend API and speed the client development.  
This project is based on the Node framework Express. The highlights are:

* Create a ReST API with two rows of code
* Create custom API easily
* Create custom middleware easily (i.e. auth middleware)
* Store data in accessible JSON files
* Reload the live changes of your mocks automatically (thanks to nodemon package)

---

## Installation
```bash
npm i jgloo --save-dev
```

After the installation create a folder "mock" in your project root (you can use another path and folder name if you want).  
The **only requirement** is to create a subfolder "api" in your chosen path (i.e. "mock/api").  
Now you are ready to create your first API.

---

## Guide

* [Create a simple API](#create-a-simple-api)
* [Create a default ReST API](#create-a-default-rest-api)
* [Create a custom ReST API](#create-a-custom-rest-api)
* [Create a middleware](#create-a-middleware)
* [Where data are stored](#where-data-are-stored)

---

### Create a simple API

To setup your first API create a new file "hello.js" in the "api" folder. The name of the file does not matter. Then insert the following snippet:

```typescript
module.exports = {
  path: '/hello',
  method: 'get',
  callback: (req, res) => {
    res.json({ message: 'Hello World!' });
  }
};
```

With this code the GET route http://localhost:3000/hello will be created and returns a JSON with data "{ message: 'Hello World!' }".

---

### Create a default ReST API

To setup a full ReST API create a new file in the "api" folder with the name you prefer and insert the following snippet:

```typescript
module.exports = {
  path: '/user',
  method: 'resource'
};
```

With these few rows of code will be created 6 routes:  
* GET /user : return the list of users
* GET /user/:id : return the specific user
* POST /user : allow to store the full request body as new user
* PUT /user/:id : allow to replace an existent user with the full request body
* PATCH /user/:id : allow to merge an existent user data with the request body values
* DELETE /user/:id : allow to delete an existent user

---

### Create a custom ReST API

If you need to control the logic of your resources you can create a custom API that read and/or write the data in the JSON database.  
To achieve it create a new file in the "api" folder with the name you prefer and insert the following snippet:

```typescript
const { getResource, setResource } = require('jgloo');

module.exports = {
  path: '/user',
  method: 'post',
  callback: (req, res) => {
    // Get the existent resource list or instantiate it
    const list = getResource('user') || [];

    // Get the data of the request and add a new field
    const user = req.body;
    user.extraField = 'value';

    // Push the new model to the list
    list.push(user);

    // Store the updated list and return the model
    setResource('user', list);
    res.json(user);
  }
};
``` 

---

### Create a middleware

To add a middleware you have to create a folder "middlewares" in your chosen root path (i.e. "mock/middlewares").  
Then create a new file inside with the name you prefer and insert the following example snippet:

```typescript
module.exports = (req, res, next) => {
  const isAuthorized = req.get('Authorization') === 'my-token';
  isAuthorized ? next() : res.sendStatus(401);
};
```

This example code check for all routes if the "Authorization" header is set and has the value "my-token".

---

### Where data are stored

The resources are stored in JSON files placed in the subfolder "db" of your chosen root path (i.e. "mock/db").  
The JSON file names reflect the resource path with the slashes replaced by the minus sign. If you want to specify the file name of the resources, you can set it as "name" property of the API:

```typescript
module.exports = {
  path: '/my/long/path',
  method: 'resource',
  name: 'user'
};
```