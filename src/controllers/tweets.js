const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

const Tweet = require('../models/tweet');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, verifyAccessToken } = require('../services/jwt');

const index = async (req, res, next) => {
  try {
    const tweets = await Tweet.findAll();
    const paginationInfo = req.getPaginationInfo(Tweet);
    res.json(new BaseSerializer({ data: { tweets, paginationInfo } }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
};
