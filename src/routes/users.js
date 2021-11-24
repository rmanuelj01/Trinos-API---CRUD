const express = require('express');
const UsersController = require('../controllers/users');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const router = express.Router();
// ###################
// Protected
// ###################

// GET /users
router.get('/', authMiddleware, paginationMiddleware, UsersController.index);

// POST /logout
router.post('/logout', authMiddleware, paginationMiddleware, UsersController.logout);

// GET /users/{id}
router.get('/:id', authMiddleware, paginationMiddleware, UsersController.getUserById);

// PUT /users/{id}
router.put('/:id', authMiddleware, UsersController.updateUser);

// DELETE /users/{id}
router.delete('/:id', authMiddleware, UsersController.deactivateUser);

// POST /users/update_password
router.post(
  '/update_password',
  authMiddleware,
  paginationMiddleware,
  UsersController.updatePassword,
);

// ###################
// Non-protected
// ###################

// POST /users
router.post('/', paginationMiddleware, UsersController.createUser);

// POST /login
router.post('/login', UsersController.login);

// POST /users/send_password_reset
router.post('/send_password_reset', UsersController.sendPasswordReset);

module.exports = router;
