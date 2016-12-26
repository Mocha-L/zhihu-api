const util = require('./util')

const getAttr = util.getAttr
const getText = util.getText
const getData = util.getData
const toNum = util.toNum
const parseSlug = util.parseSlug

module.exports = {
  /**
   * Answers.
   */
  answers($) {
    var eles = $('.zm-item[data-type="Answer"]')
    return util.map(eles, ele => _parseAnswer($, ele))
  }
}

/**
 * @private
 */
function _parseAnswer($, ele) {
  var questionEle = $('.zm-item-title a', ele)
  var answerEle = $('.zm-item-answer', ele)
  var voteupEle = $('.zm-votebar .count', ele)
  var authorEle = $('.zm-item-answer-author-info .author-link', ele)
  var contentEle = $('.zm-item-rich-text textarea', ele)
  var commentsEle = $('.zm-item-meta .toggle-comment', ele)

  var answer = {
    id: getData(answerEle, 'atoken'),
    type: 'answer',
    aid: getData(answerEle, 'aid'),
    voteup_count: toNum(getText(voteupEle)),
    comment_count: toNum(getText(commentsEle).split(' ')[0]),
    content: getText(contentEle),
    created_time: getData(answerEle, 'created'),
    author: {
      name: getText(authorEle)
    },
    question: {
      id: toNum(getAttr(questionEle, 'href').substring('/question/'.length)),
      type: 'question',
      title: getText(questionEle)
    }
  }
  Object.assign(answer.author, parseSlug(getAttr(authorEle, 'href')))

  return answer
}
