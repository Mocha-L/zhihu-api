const parser = require('../parser/user')
const baseurl = require('../urls').baseurl

module.exports = function(req) {
  /**
   * Initialize a `User`.
   *
   * @param {String} url_token
   * @public
   */
  function User(url_token) {
    if (!(this instanceof User)) {
      return new User(url_token)
    }

    if (typeof url_token !== 'string' || !url_token) {
      throw new Error('url_token must be a non-empty string')
    }

    this.url_token = url_token
    this.url = `${baseurl}/people/${url_token}`
  }

  User.prototype._req = req
  Object.assign(User.prototype, proto)

  return User
}

var proto = {
  /**
   * Profile.
   *
   * @return {Promise}
   * @public
   */
  profile() {
    var url = `/api/v4/members/${this.url_token}`
    var params = {
      include: [
        'locations',
        'employments',
        'gender',
        'educations',
        'business',
        'voteup_count',
        'thanked_Count',
        'follower_count',
        'following_count',
        'cover_url',
        'following_topic_count',
        'following_question_count',
        'following_favlists_count',
        'following_columns_count',
        'avatar_hue',
        'answer_count',
        'articles_count',
        'pins_count',
        'question_count',
        'columns_count',
        'commercial_question_count',
        'favorite_count',
        'favorited_count',
        'logs_count',
        'marked_answers_count',
        'marked_answers_text',
        'message_thread_token',
        'account_status',
        'is_active',
        'is_bind_phone',
        'is_force_renamed',
        'is_bind_sina',
        'is_privacy_protected',
        'sina_weibo_url',
        'sina_weibo_name',
        'show_sina_weibo',
        'is_blocking',
        'is_blocked',
        'is_following',
        'is_followed',
        'mutual_followees_count',
        'vote_to_count',
        'vote_from_count',
        'thank_to_count',
        'thank_from_count',
        'thanked_count',
        'description',
        'hosted_live_count',
        'participated_live_count',
        'allow_message',
        'industry_category',
        'org_name',
        'org_homepage',
        'badge[?(type=best_answerer)].topics'
      ].join(',')
    }

    return this._req.get(url, params)
  },

  /**
   * Activities.
   *
   * @param  {Number} after_id
   * @param  {Number} before_id
   * @return {Promise}
   * @public
   */
  activities(after_id, before_id) {
    var url = `/api/v4/members/${this.url_token}/activities`
    var params = {
      limit: 5,
      include: [
        [
          'data[?(target.type=answer)].target.is_normal',
          'suggest_edit',
          'content',
          'voteup_count',
          'comment_count',
          'collapsed_counts',
          'reviewing_comments_count',
          'mark_infos',
          'created_time',
          'updated_time'
        ].join(','),
        'data[?(target.type=answer)].target.badge[?(type=best_answerer)].topics', [
          'data[?(target.type=article)].target.column',
          'content',
          'voteup_count',
          'comment_count',
          'collapsed_counts',
          'reviewing_comments_count',
          'comment_permission',
          'created',
          'updated',
          'upvoted_followees',
          'voting'
        ].join(','), [
          'data[?(target.type=column)].target.title',
          'intro',
          'description',
          'articles_count',
          'followers'
        ].join(','),
        'data[?(target.type=topic)].target.introduction',
        'data[?(verb=MEMBER_COLLECT_ANSWER)].extra_object',
        'data[?(verb=MEMBER_COLLECT_ARTICLE)].extra_object'
      ].join(';')
    }

    if (after_id) {
      params.after_id = after_id
    }
    if (before_id) {
      params.before_id = before_id
    }

    return this._req.get(url, params)
      .then(parser.activities)
  },

  /**
   * Asked questions.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  questions(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/questions`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].created',
        'follower_count',
        'answer_count'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.questions)
  },

  /**
   * Answers.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  answers(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/answers`
    var params = {
      offset,
      limit: 20,
      sort_by: 'created',
      include: [
        'data[*].is_normal',
        'comment_count',
        'collapsed_counts',
        'reviewing_comments_count',
        'content',
        'voteup_count',
        'reshipment_settings',
        'mark_infos',
        'created_time',
        'updated_time'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.answers)
  },

  /**
   * Articles.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  articles(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/articles`
    var params = {
      offset,
      limit: 20,
      sort_by: 'created',
      include: [
        'data[*].comment_count',
        'collapsed_counts',
        'reviewing_comments_count',
        'content',
        'voteup_count',
        'created',
        'updated'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.articles)
  },

  /**
   * Collections.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  collections(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/favlists`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].updated_time',
        'follower_count',
        'answer_count',
        'is_public'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.collections)
  },

  /**
   * Followers.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followers(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/followers`
    var params = {
      offset,
      limit: 20
    }

    return this._req.get(url, params)
      .then(parser.follows)
  },

  /**
   * Followees.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followees(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/followees`
    var params = {
      offset,
      limit: 20
    }

    return this._req.get(url, params)
      .then(parser.follows)
  },

  /**
   * Owned columns and contributions.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  columns(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/column-contributions`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].column.title',
        'intro',
        'description',
        'followers',
        'articles_count'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.columns)
  },

  /**
   * Following columns.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followingColumns(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/following-columns`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].intro',
        'followers',
        'articles_count',
        'image_url',
        'is_following'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.followingColumns)
  },

  /**
   * Following topics and contributions.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followingTopics(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/following-topic-contributions`
    var params = {
      offset,
      limit: 20
    }

    return this._req.get(url, params)
      .then(parser.followingTopics)
  },

  /**
   * Following questions.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followingQuestions(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/following-questions`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].created',
        'answer_count',
        'follower_count'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.followingQuestions)
  },

  /**
   * Following collections.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  followingCollections(offset = 0) {
    var url = `/api/v4/members/${this.url_token}/following-favlists`
    var params = {
      offset,
      limit: 20,
      include: [
        'data[*].updated_time',
        'answer_count',
        'follower_count'
      ].join(',')
    }

    return this._req.get(url, params)
      .then(parser.collections)
  }
}
