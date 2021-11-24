const COMMENTS = [];

/**
 *
 * @param {{
 * text: string
 * likeCounter: integer
 * tweetId: inteer
 * }} comment
 *
 * @returns {Object}
 */
const create = (comment) => new Promise((resolve, reject) => {
  const newComment = {
    id: COMMENTS.length + 1,
    likeCounter: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...comment,
  };

  COMMENTS.push(newComment);

  resolve(newComment);
});

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @param {(find|filter)} kind
 * @returns {Object|Array}
 */
const find = ({ where }, kind) => new Promise((resolve, reject) => {
  const filters = Object.keys(where);
  const comment = COMMENTS[kind]((obj) => {
    let match = true;
    filters.forEach((filter) => {
      // eslint-disable-next-line eqeqeq
      if (obj[filter] != where[filter]) {
        match = false;
      }
    });
    return match;
  });

  resolve(comment);
});

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const findOne = (where) => find(where, 'find');

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns number
 */
const count = async (where) => (await find(where, 'filter')).length;

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const update = (whereClause, newValues) => new Promise((resolve, reject) => {
  findOne(whereClause)
    .then((user) => {
      if (!user) {
        resolve(null);
      }
      Object.assign(user, newValues);
      resolve(user);
    })
    .catch((err) => reject(err));
});

module.exports = {
  create,
  findOne,
  update,
  count,
};
