const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const request = require('request')
const cheerio = require('cheerio')
const userAgent = require('ua-string')
const mkdirp = require('mkdirp')
const parseCookie = require('cookie').parse
const urls = require('./urls')
const debug = require('debug')('zhihu-api')

module.exports = Request

/**
 * Request wrapper.
 */
function Request() {
  this.headers = {
    'Cookie': '',
    'Authorization': '',
    'Referer': urls.baseurl,
    'User-Agent': userAgent
  }
  this._xsrf = ''
}

/**
 * Set cookie.
 *
 * @param {String|Buffer} cookie
 * @public
 */
Request.prototype.setCookie = function(cookie) {
  if (!cookie) {
    return
  }

  if (Buffer.isBuffer(cookie)) {
    cookie = cookie.toString()
  }
  cookie = (cookie || '').trim()

  var parsedCookie = parseCookie(cookie)

  if (!parsedCookie.z_c0) {
    throw new Error('Invalid cookie: no authorization (z_c0) in cookie')
  }

  if (!parsedCookie._xsrf) {
    throw new Error('Invalid cookie: no _xsrf in cookie')
  }

  this.headers['Cookie'] = cookie
  this.headers['Authorization'] = `Bearer ${parsedCookie.z_c0}`
  this._xsrf = parsedCookie._xsrf
}

/**
 * Set proxy.
 *
 * @param {String} proxy
 * @public
 */
Request.prototype.setProxy = function(proxy) {
  this.proxy = proxy
}

/**
 * Send an HTTP request.
 *
 * @param  {Object}  opts
 * @return {Promise}
 * @public
 */
Request.prototype.request = function(opts) {
  opts.url = urls.full(opts.url)

  if (!opts.headers) {
    opts.headers = this.headers
  }

  if (this.proxy) {
    opts.proxy = this.proxy
  }

  return sendRequest(opts)
}

/**
 * Send a GET request.
 *
 * @param  {String}  url
 * @param  {Object}  params
 * @return {Promise}
 * @public
 */
Request.prototype.get = function(url, params) {
  if (params) {
    url += '?' + querystring.stringify(params)
  }

  var opts = {
    url,
    method: 'GET'
  }

  return this.request(opts)
}

/**
 * Send a POST request with JSON body.
 *
 * @param  {String} url
 * @param  {Object} data
 * @return {Promise}
 * @public
 */
Request.prototype.post = function(url, data) {
  var opts = {
    url,
    method: 'POST'
  }

  if (data) {
    opts.json = data
  }

  return this.request(opts)
}

/**
 * Send a POST request with form body.
 *
 * @param  {String} url
 * @param  {Object} data
 * @return {Promise}
 * @public
 */
Request.prototype.postForm = function(url, data) {
  var opts = {
    url,
    method: 'POST'
  }

  if (data) {
    opts.form = data
  }

  return this.request(opts)
}

/**
 * Send a DELETE request.
 *
 * @param  {String} url
 * @return {Promise}
 * @public
 */
Request.prototype.delete = function(url) {
  var opts = {
    url,
    method: 'DELETE'
  }

  return this.request(opts)
}

/**
 * Download file.
 *
 * @param  {Object} opts
 * @return {Promise}
 * @public
 */
Request.prototype.download = function(opts) {
  if (!fs.existsSync(opts.dir)) {
    mkdirp.sync(opts.dir)
  }

  var file = path.join(opts.dir, opts.filename)

  debug('DOWNLOAD', opts.src)

  return new Promise((resolve, reject) => {
    request.get(opts.src)
      .on('response', res => {
        res.pipe(fs.createWriteStream(file))
        res.on('error', reject)
        res.on('end', () => resolve(opts))
      })
  })
}

/**
 * @param  {Object} opts
 * @return {Promise}
 * @private
 */
function sendRequest(opts) {
  if (opts.json) {
    debug(opts.method, opts.url, JSON.stringify(opts.json))
  } else if (opts.form) {
    debug(opts.method, opts.url, querystring.stringify(opts.form))
  } else {
    debug(opts.method, opts.url)
  }

  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err) {
        return reject(err)
      }

      var contentType = res.headers['content-type'] || ''
      var ret = body

      if (contentType.indexOf('application/json') >= 0) {
        try {
          ret = JSON.parse(body)
        } catch (e) {
          ret = body
        }
      } else if (contentType.indexOf('text/html') >= 0) {
        try {
          ret = cheerio.load(body)
        } catch (e) {
          ret = body
        }
      }

      resolve(ret)
    })
  })
}
