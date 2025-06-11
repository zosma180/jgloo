export default {
  path: '/upload',
  method: 'post',
  callback: (req, res) => {
    res.json({ message: 'Upload completed!' });
  },
};