const baseurl = exports.baseurl = 'https://www.zhihu.com'
const columnUrl = exports.columnUrl = 'https://zhuanlan.zhihu.com'

/**
 * Return the full url with given `path`.
 *
 * Examples:
 *
 *   full('')
 *   // => ''
 *   full('/path')
 *   // => 'https://www.zhihu.com/path'
 *   full('path')
 *   // => 'https://www.zhihu.com/path'
 *   full('https://www.zhihu.com/path')
 *   // => 'https://www.zhihu.com/path'
 *
 * @param {string} path
 * @return {string}
 * @public
 */
exports.full = function(path) {
  if (!path) {
    return ''
  }

  if (path.indexOf(baseurl) === 0) {
    return path
  }

  if (path.indexOf(columnUrl) === 0) {
    return path
  }

  if (path[0] !== '/') {
    path = '/' + path
  }
  return `${baseurl}${path}`
}
