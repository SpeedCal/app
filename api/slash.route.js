const util = require('./util')
const config = require('./env').config()
const pkg = require('root-require')('package.json')

/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
exports.route = async (req, res) => {
  const logger = util.createLogger('snap.route')
  return res.json({version: pkg.version})
}
