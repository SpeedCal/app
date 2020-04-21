const util = require('./util')
const config = require('./env').config()


/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
exports.route = async (req, res) => {
  const logger = util.createLogger('snap.route')
  return res.json({apiVersion: 1, appVersion: 2})
}
