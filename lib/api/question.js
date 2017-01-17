const parser = require('../parser/question')
const baseurl = require('../urls').baseurl

module.exports = function(req) {
  /**
   * Initialize a `Question`.
   *
   * @param {Number} id
   * @public
   */
  function Question(id) {
    if (!(this instanceof Question)) {
      return new Question(id)
    }

    this.id = id
    this.url = `${baseurl}/question/${this.id}`
  }

  Question.prototype._req = req
  Object.assign(Question.prototype, proto)

  return Question
}

var proto = {
  /**
   * Answers by voteup weights.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  answersByVote(offset = 0) {
    return this._answers('default', offset)
  },

  /**
   * Answers by page (or created time).
   *
   * @param  {Number} page
   * @return {Promise}
   * @public
   */
  answersByCreated(offset = 0) {
    return this._answers('created', offset)
  },

  /**
   * Get answers.
   *
   * @param  {String} sort_by 'default' or 'created'
   * @param  {Number} offset
   * @return {Promise}
   * @private
   */
  _answers(sort_by = 'default', offset = 0) {
    var url = `/api/v4/questions/${this.id}/answers`
    var params = {
      sort_by,
      offset,
      limit: 20,
      include: [
        'data[*].is_normal',
        'is_sticky',
        'collapsed_by',
        'suggest_edit',
        'comment_count',
        'collapsed_counts',
        'reviewing_comments_count',
        'content',
        'voteup_count',
        'reshipment_settings',
        'comment_permission',
        'mark_infos',
        'created_time',
        'updated_time'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.answers)
  },

  /**
   * Get detail of a question.
   *
   * @return {Promise}
   * @public
   */
  detail() {
    var url = `/api/v4/questions/${this.id}`
    return this._req.get(url)
  },

  /**
   * Get followers of a question.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followers(offset = 0) {
    var url = `/api/v4/questions/${this.id}/followers`
    var params = {
      offset,
      limit: 20
    }

    return this._req.get(url, params)
      .then(parser.followers)
  }
}
