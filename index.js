const Request = require('./lib/request')
const user = require('./lib/api/user')
const topic = require('./lib/api/topic')
const question = require('./lib/api/question')
const answer = require('./lib/api/answer')
const collection = require('./lib/api/collection')
const image = require('./lib/api/image')
const action = require('./lib/api/action')
const column = require('./lib/api/column')

module.exports = function() {
  var req = new Request()
  var api = {
    cookie(val) {
      if (!arguments.length) {
        return req.headers['Cookie']
      } else {
        req.setCookie(val)
      }
    },

    proxy(val) {
      if (!arguments.length) {
        return req.proxy
      } else {
        req.setProxy(val)
      }
    },

    auth(val) {
      if (!arguments.length) {
        return req.headers['Authorization']
      } else {
        req.setAuth(val)
      }
    },

    user: user(req),
    topic: topic(req),
    question: question(req),
    answer: answer(req),
    collection: collection(req),
    image: image(req),
    action: action(req),
    column: column(req),

    _request: req,
    version: require('./package').version
  }

  return api
}
