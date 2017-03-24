const cheerio = require('cheerio')
const util = require('./util')
const urls = require('../urls')

const getAttr = util.getAttr
const getText = util.getText
const getData = util.getData
const toNum = util.toNum
const parseSlug = util.parseSlug

module.exports = {
  /**
   * Hierarchy.
   */
  hierarchy($) {
    var linkEle = $('.topic-avatar .zm-entry-head-avatar-link')
    var link = getAttr(linkEle, 'href')
    var avatarEle = $('img', linkEle)
    var parentEles = $('#zh-topic-organize-parent-editor .zm-item-tag')
    var childEles = $('#zh-topic-organize-child-editor .zm-item-tag')
    var sidebarEle = $('#zh-topic-side-head')
    var focusEle = $('.zu-entry-focus-button', sidebarEle)
    var followerEle = $('.zm-topic-side-followers-info strong', sidebarEle)

    var topic = {
      id: toNum(link.substring('/topic/'.length)),
      type: 'topic',
      tid: toNum(getAttr(focusEle, 'id').substring('tf-'.length)),
      url: urls.full(link),
      name: getAttr(avatarEle, 'alt'),
      avatar_url: getAttr(avatarEle, 'src'),
      follower_count: toNum(getText(followerEle)),
      parents: _parseHierarchyLabels($, parentEles),
      children: _parseHierarchyLabels($, childEles)
    }

    return topic
  },

  /**
   * Followers.
   */
  followers(html) {
    var $ = cheerio.load(html)
    var eles = $('.zm-person-item')

    return util.map(eles, ele => _parseTopicFollower($, $(ele)))
  },

  /**
   * Answers.
   */
  answers($) {
    $ = typeof $ === 'string' ? cheerio.load($) : $
    var eles = $('.feed-item')
    return util.map(eles, ele => _parseTopicAnswer($, $(ele)))
  },

  /**
   * Questions.
   */
  questions($) {
    var eles = $('.feed-item')
    return util.map(eles, ele => _parseTopicQuestion($, $(ele)))
  }
}

/**
 * @private
 */
function _parseHierarchyLabels($, eles) {
  return util.map(eles, ele => parseLabel($, $(ele)))

  function parseLabel($, ele) {
    var link = getAttr(ele, 'href').replace('/organize', '')
    var topic = {
      id: getData(ele, 'token'),
      type: 'topic',
      tid: getData(ele, 'topicid'),
      name: getText(ele).trim(),
      url: urls.full(link)
    }
    return topic
  }
}

/**
 * @private
 */
function _parseTopicFollower($, ele) {
  var followEle = $('.zg-btn', ele)
  var nameEle = $('.zm-list-content-title a', ele)
  var link = getAttr(nameEle, 'href')

  var follower = Object.assign({
    id: getAttr(followEle, 'id').substring('pp-'.length),
    name: getText(nameEle),
    followtime: toNum(getAttr(ele, 'id').substring('mi-'.length)) * 1000
  }, parseSlug(link))

  return follower
}

/**
 * @private
 */
function _parseTopicAnswer($, ele) {
  var aidEle = $('meta[itemprop="answer-id"]')
  var quesEle = $('.question_link', ele)
  var quesLink = getAttr(quesEle, 'href')
  var entryEle = $('.entry-body', ele)
  var agreesEle = $('.zm-item-vote-info', entryEle)
  var authorEle = $('.zm-item-answer-author-info .author-link', entryEle)
  var authorLink = getAttr(authorEle, 'href')
  var answerEle = $('.zm-item-rich-text', entryEle)
  var answerLink = getData(answerEle, 'entry-url')
  var contentEle = $('textarea', answerEle)
  var commentsEle = $('.zm-item-meta .toggle-comment', ele)

  var answer = {
    id: toNum(answerLink.substring(answerLink.lastIndexOf('/') + 1)),
    type: 'answer',
    aid: toNum(getAttr(aidEle, 'content')),
    resourceid: getData(answerEle, 'resourceid'),
    url: urls.full(answerLink),
    voteup_count: getData(agreesEle, 'votecount'),
    comment_count: toNum(getText(commentsEle).split(' ')[0]),
    content: getText(contentEle),
    author: {
      name: getText(authorEle)
    },
    question: {
      id: toNum(quesLink.substring('/question/'.length)),
      type: 'question',
      title: getText(quesEle)
    },
    score: getData(ele, 'score')
  }
  Object.assign(answer.author, parseSlug(authorLink))

  return answer
}

/**
 * @private
 */
function _parseTopicQuestion($, ele) {
  var linkEle = $('.question_link', ele)
  var link = getAttr(linkEle, 'href')
  var answersEle = $('meta[itemprop="answerCount"]', ele)
  var followersEle = $('.question-item-meta .meta-item:nth-child(3)', ele)

  var question = {
    id: toNum(link.substring('/question/'.length)),
    type: 'question',
    url: urls.full(link),
    title: getText(linkEle),
    answer_count: toNum(getAttr(answersEle, 'content')),
    follower_count: toNum(getText(followersEle).split(' ')[0])
  }

  return question
}
