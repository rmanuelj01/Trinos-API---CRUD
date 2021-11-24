const TWEETS = [];

/**
 *
 * @param {{
 * text: string
 * likeCounter: integer
 * user: User
 * comments: [comment]
 * tweetId: inteer
 * }} comment
 *
 * @returns {Object}
 */
const create = (comment) => new Promise((resolve, reject) => {
  const newTweet = {
    id: TWEETS.length + 1,
    likeCounter: 0,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...comment,
  };

  TWEETS.push(newTweet);

  resolve(newTweet);
});

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @param {(find|filter)} kind
 * @returns {Object|Array}
 */
const find = ({ where }, kind) => new Promise((resolve, reject) => {
  const filters = Object.keys(where);
  const tweet = TWEETS[kind]((obj) => {
    let match = true;
    filters.forEach((filter) => {
      // eslint-disable-next-line eqeqeq
      if (obj[filter] != where[filter]) {
        match = false;
      }
    });
    return match;
  });

  resolve(tweet);
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

const findAll = () => new Promise((resolve, reject) => {
  resolve(TWEETS).catch((err) => reject(err));
});

module.exports = {
  create,
  findAll,
  findOne,
  update,
  count,
};
