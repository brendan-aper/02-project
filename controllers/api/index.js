const router = require('express').Router();

const indexRoutes = require('./indexRoutes');

// router.use('/index', indexRoutes);

// const userRoutes = require('./users');

router.use('/user', userRoutes)

module.exports = router;