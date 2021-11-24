const express = require('express');
const TweetController = require('../controllers/tweets');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const router = express.Router();
// ###################
// Protected
// ###################

// GET /users
router.get('/', authMiddleware, paginationMiddleware, TweetController.index);

module.exports = router;
