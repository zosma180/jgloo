export default {
  path: '/hello',
  method: 'get',
  callback: (req, res) => {
    res.json({ message: 'Hello World!' });
  },
};