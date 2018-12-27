const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');

router.get('/', (req, res, next) => {
  res.send('nothing here');
});

router.use('/api', apiRoutes);

module.exports = router;
