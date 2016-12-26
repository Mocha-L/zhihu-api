const only = require('only')
const urls = require('../urls')
const util = require('./util')
const refProps = require('./refProps')

const getAttr = util.getAttr
const getData = util.getData
const getText = util.getText
const toNum = util.toNum
const parseSlug = util.parseSlug

module.exports = {
  /**
   * Voters.
   */
  voters(data) {
    if (!data || !data.data) {
      return []
    }

    return data.data.map(obj => only(obj, refProps.user))
  },

  /**
   * Comments.
   */
  comments(data) {
    if (!data || !data.data) {
      return []
    }

    var props = [
      'id',
      'type',
      'resource_type',
      'content',
      'vote_count',
      'created_time'
    ]
    var authorProps = refProps.user

    return data.data.map(obj => {
      var comment = only(obj, props)

      comment.author = {
        role: obj.author.role
      }
      comment.author.member = only(obj.author.member, authorProps)

      if (obj.reply_to_author) {
        comment.reply_to_author = {
          role: obj.reply_to_author.role
        }
        comment.reply_to_author.member = only(obj.reply_to_author.member, authorProps)
      }

      return comment
    })
  },

  /**
   * Explore answers.
   */
  explore($) {
    var eles = $('.feed-item')
    return util.map(eles, ele => _parseExplore($, $(ele)))
  }
}

function _parseExplore($, ele) {
  var quesEle = $('.question_link', ele)
  var quesLink = getAttr(quesEle, 'href')
  var link = quesLink
  quesLink = quesLink.substring(0, quesLink.indexOf('/answer'))
  var itemEle = $('.zm-item-answer', ele)
  var agreesEle = $('.zm-item-vote-info', itemEle)
  var authorEle = $('.zm-item-answer-author-info .author-link', itemEle)
  var authorLink = getAttr(authorEle, 'href')
  var answerEle = $('.zm-item-rich-text', itemEle)
  var contentEle = $('textarea', answerEle)
  var commentEle = $('.zm-item-meta .toggle-comment', ele)

  var answer = {
    id: getData(itemEle, 'atoken'),
    type: 'answer',
    aid: getData(itemEle, 'aid'),
    resourceid: getData(answerEle, 'resourceid'),
    url: urls.full(link),
    voteup_count: getData(agreesEle, 'votecount'),
    comment_count: toNum(getText(commentEle).split(' ')[0]),
    content: getText(contentEle),
    created_time: getData(itemEle, 'created'),
    author: {
      name: getText(authorEle)
    },
    question: {
      id: toNum(quesLink.substring('/question/'.length)),
      type: 'question',
      title: getText(quesEle)
    }
  }
  Object.assign(answer.author, parseSlug(authorLink))

  return answer
}
