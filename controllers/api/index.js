const router = require('express').Router();
const userRoutes = require('./userRoutes');
const tripRoutes = require('./tripRoutes');
const commentRoutes = require('./commentRoutes');
const locationRoutes = require('./locationRoutes');
const imageRoutes = require('./imageRoutes')

router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/comments', commentRoutes);
router.use('/locations', locationRoutes);
router.use('/images', imageRoutes);

module.exports = router;
