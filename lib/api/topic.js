const parser = require('../parser/topic')
const baseurl = require('../urls').baseurl

// http://www.zhihu.com/api/v4/topics/19550235

const proto = {
  detail() {
    const url = `/api/v4/topics/${this.id}`

    return this._req.get(url)
  },

  /**
   * Get the hierarchy information of the topic.
   *
   * @public
   */
  hierarchy() {
    var url = `/topic/${this.id}/organize`
    return this._req.get(url)
      .then(parser.hierarchy)
  },

  /**
   * Get followers of the topic.
   *
   * @param {Number} start  timestamp in seconds
   * @param {Number} offset
   * @public
   */
  followers(start = '', offset = 0) {
    var url = `/topic/${this.id}/followers`
    var form = {
      start,
      offset,
      _xsrf: this._req._xsrf
    }

    return this._req.postForm(url, form)
      .then(data => parser.followers(data.msg[1]))
  },

  /**
   * Get top answers of the topic.
   *
   * @param {Number} page
   * @public
   */
  topAnswers(page = 1) {
    var url = `/topic/${this.id}/top-answers`
    var params = {
      page
    }

    return this._req.get(url, params)
      .then(parser.answers)
  },

  /**
   * Get hot answers of the topic.
   *
   * @param {Number} offset answer score
   * @public
   */
  hotAnswers(offset = '') {
    var url = `/topic/${this.id}/hot`
    var form = {
      offset,
      start: 0,
      _xsrf: this._req._xsrf
    }

    return this._req.postForm(url, form)
      .then(data => parser.answers(data.msg[1]))
  },

  /**
   * Get new answers of the topic.
   *
   * @param {Number} offset answer score
   * @public
   */
  newAnswers(offset = '') {
    var url = `/topic/${this.id}/newest`
    var form = {
      offset,
      start: 0,
      _xsrf: this._req._xsrf
    }

    return this._req.postForm(url, form)
      .then(data => parser.answers(data.msg[1]))
  },

  /**
   * Get pending questions of the topic.
   *
   * For more information about what is a pending question, see:
   * https://www.zhihu.com/question/40470324
   *
   * @param {Number} page
   * @public
   */
  pendingQuestions(page = 1) {
    var url = `/topic/${this.id}/questions`
    var params = {
      page
    }

    return this._req.get(url, params)
      .then(parser.questions)
  },

  /**
   * Get hot pending questions of the topic.
   *
   * For more information about what is a pending question, see:
   * https://www.zhihu.com/question/40470324
   *
   * @param {Number} page
   * @public
   */
  hotPendingQuestions(page = 1) {
    var url = `/topic/${this.id}/unanswered`
    var params = {
      page
    }

    return this._req.get(url, params)
      .then(parser.questions)
  }
}

module.exports = function(req) {
  /**
   * Initialize a `Topic`.
   *
   * @param {Number} id
   * @public
   */
  function Topic(id) {
    if (!(this instanceof Topic)) {
      return new Topic(id)
    }

    this.id = id
  }

  Topic.root = new Topic(19776749)

  Topic.prototype._req = req
  Object.assign(Topic.prototype, proto)

  return Topic
}
