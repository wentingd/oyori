const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');

router.get('/', (req, res, next) => {
  res.send('Hello Oyori');
});

router.use('/api', apiRoutes);

module.exports = router;
