const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');

const params = process.argv.slice(2);
const db = `${params[0]}/db`;

module.exports = {
  getResource: name => {
    const path = `${db}/${name}.json`;
    if (!existsSync(path)) { return null; }
    const file = readFileSync(path);

    try {
      return JSON.parse(file);
    } catch (error) {
      throw new Error(`${file}.json is an invalid JSON.`);
    }
  },

  setResource: (name, value) => {
    if (!existsSync(db)) { mkdirSync(db); }
    const path = `${db}/${name}.json`;
    writeFileSync(path, JSON.stringify(value), 'utf8');
  },

  getDelayMiddleware: (delay) => {
    return (_, __, next) => {
      setTimeout(() => next(), delay * 1000);
    };
  },
}