const columnUrl = require('../urls').columnUrl

module.exports = function(req) {
  /**
   * Initialize a `Column`.
   *
   * @param {String} slug
   * @public
   */
  function Column(slug) {
    if (!(this instanceof Column)) {
      return new Column(slug)
    }

    this.slug = slug
    this.url = `${columnUrl}/${slug}`
  }

  Column.prototype._req = req
  Object.assign(Column.prototype, proto)

  return Column
}

var proto = {
  /**
   * Column information.
   *
   * @return {Promise}
   * @public
   */
  info() {
    var url = `${columnUrl}/api/columns/${this.slug}`
    return this._req.get(url)
  },

  /**
   * Pin top posts.
   *
   * @return {Promise}
   * @public
   */
  pins() {
    var url = `${columnUrl}/api/columns/${this.slug}/pins`
    return this._req.get(url)
  },

  /**
   * Column posts.
   *
   * @param  {Number} offset
   * @return {Promise}
   * @public
   */
  posts(offset = 0) {
    var url = `${columnUrl}/api/columns/${this.slug}/posts`
    var params = {
      offset,
      limit: 20
    }

    return this._req.get(url, params)
  },

  /**
   * Authors.
   *
   * @return {Promise}
   * @public
   */
  authors() {
    var url = `${columnUrl}/api/columns/${this.slug}/authors`
    return this._req.get(url)
  }
}
