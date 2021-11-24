const { verifyAccessToken } = require('../services/jwt');
const ApiError = require('../utils/ApiError');

function authMiddleware(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    if (accessToken == null) {
      throw new ApiError('Access token required', 401);
    }

    const user = verifyAccessToken(accessToken);
    req.user = user;

    next();
  } catch ({ message, statusCode }) {
    next(new ApiError(message, statusCode || 400));
  }
}

module.exports = {
  authMiddleware,
};
