const only = require('only')
const refProps = require('./refProps')

module.exports = {
  /**
   * Answers by voteup weights.
   */
  answers(data) {
    if (!data || !data.data) {
      return []
    }

    var props = [
      'id',
      'type',
      'is_normal',
      'voteup_count',
      'collapsed_counts',
      'comment_count',
      'reviewing_comments_count',
      'reshipment_settings',
      'content',
      'created_time',
      'updated_time',
      'mark_infos'
    ]
    var authorProps = refProps.user
    var questionProps = refProps.question

    return data.data.map(obj => {
      var answer = only(obj, props)
      answer.author = only(obj.author, authorProps)
      answer.question = only(obj.question, questionProps)
      return answer
    })
  },

  /**
   * Followers.
   */
  followers(data) {
    if (!data || !data.data) {
      return []
    }

    var props = [
      'id',
      'name',
      'type',
      'user_type',
      'url_token',
      'headline',
      'avatar_url',
      'badge'
    ]

    return data.data.map(obj => only(obj, props))
  }
}
