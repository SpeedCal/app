const fs = require('fs')

const util = require('./util')
const config = require('./env').config()
const browser = require('./browser')


/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
exports.route = async (req, res) => {
  const logger = util.createLogger('slash.route')
  const hrstart = process.hrtime()
  const filePath = util.buildFilepath(req._parsedUrl)

  if (!fs.existsSync(filePath)) {
    const url = `${config.REACT_APP_URL}:${config.REACT_APP_PORT}${req.url}`
    await browser.storeSnapshot(url, filePath)
  }

  res.set('X-RCA-birthtime', util.getFileBirthtime(filePath))

  const hrend = process.hrtime(hrstart)
  res.set('X-RCA-rendertime-ms', hrend[1] / 1000000)
  return res.sendFile(filePath)
}
