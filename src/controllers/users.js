const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

const User = require('../models/user');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, verifyAccessToken } = require('../services/jwt');

const auth = {
  auth: {
    api_key: process.env.MG_API_KEY,
    domain: process.env.MG_API_DOMAIN,
  },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const {
      username, email, name, password,
    } = body;

    if (username && email && name && password) {
      const user = await User.create({
        username,
        email,
        name,
        password,
      });

      res.json(new UserSerializer(user));
    } else {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user && user.active) res.json(new UserSerializer(user));
    else throw new ApiError('User not found', 400);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;
    const { username, email, name } = body;

    if (username || email || name) {
      let user = await User.findOne({ where: { id: params.id } });
      if (user && user.active) {
        user = await User.update({ where: { id: params.id } }, body);
        res.json(new UserSerializer(user));
      } else {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.update({ where: { id: params.id } }, { active: false });
    if (user != null) res.json(new UserSerializer(null));
    else throw new ApiError('User not found', 400);
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const paginationInfo = req.getPaginationInfo(User);
    res.json(new BaseSerializer({ data: { users, paginationInfo } }));
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { body } = req;

    const { password, passwordConfirmation } = body;

    if (password !== passwordConfirmation) {
      throw new ApiError('error', 400);
    }

    const accessToken = req.headers.authorization?.split(' ')[1];
    let user = verifyAccessToken(accessToken);

    if (user && user.active) {
      user = await User.update({ where: { password } }, body);
      res.json(new UserSerializer(user));
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { body } = req;

    const { username, password } = body;

    if (password && username) {
      const user = await User.findOne({
        where: { username, password },
      });
      if (user && user.active) {
        const accessToken = generateAccessToken(user.id);
        res.json(new BaseSerializer({ data: { accessToken } }));
      } else {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('error', 400);
    }
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const user = verifyAccessToken(accessToken);
    res.json(new BaseSerializer({ data: { user } }));
  } catch (err) {
    next(err);
  }
};

const sendMail = (mail) => {
  nodemailerMailgun.sendMail({
    from: 'myemail@example.com',
    to: mail, // An array if you have multiple recipients.
    subject: 'Password reset',
    text: 'Mailgun rocks, pow pow!',
  });
};

const sendPasswordReset = async (req, res, next) => {
  try {
    const { body } = req;

    const { username } = body;

    if (username) {
      const user = await User.findOne({
        where: { username },
      });
      if (user && user.active) {
        sendMail(user.email);
        res.json(new BaseSerializer({ data: 'success' }));
      } else {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('error', 400);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  deactivateUser,
  getUserById,
  index,
  login,
  logout,
  sendPasswordReset,
  updatePassword,
  updateUser,
};
