const fs = require('fs')

const util = require('./util')
const config = require('./env').config()
const browser = require('./browser')
const logger = util.createLogger('stats.route')


/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
exports.route = async (req, res) => {
  const hrstart = process.hrtime()
  const filePath = util.buildFilepath(req._parsedUrl)

  if (!fs.existsSync(filePath)) {
    try {
      await browser.getPage().goto(`http://localhost:${config.PORT}${req.url}`);
      await browser.getPage().screenshot({path: filePath});
      logger.info(`Generating new snapshot: ${filePath}`)
    } catch(err) {
      logger.error('browser.newPage :: ', err)
      return res.status(500).send({message: 'Error connecting to upstream snapshot service'})
    }
  }

  try {
    const stat = fs.statSync(filePath)
    res.set('X-RCA-birthtime', stat.birthtime)
  } catch(err) {
    logger.error('fs.statSync :: ', err)
    return res.status(500).send({message: 'Error fetching file stats'})
  }

  const hrend = process.hrtime(hrstart)
  res.set('X-RCA-rendertime-ms', hrend[1] / 1000000)
  return res.sendFile(filePath)
}
