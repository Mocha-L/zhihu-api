const only = require('only')

function reduce(obj, arr) {
  if (!obj) {
    return null
  }
  return only(obj, arr)
}

module.exports = {
  topic(obj) {
    return reduce(obj, ['id', 'name', 'type', 'url'])
  },

  user(obj) {
    return reduce(obj, ['id', 'name', 'type', 'user_type', 'url_token', 'url'])
  },

  question(obj) {
    return reduce(obj, ['id', 'type', 'title', 'url'])
  }
}
