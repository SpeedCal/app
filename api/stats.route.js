const fs = require('fs')

const util = require('./util')
const config = require('./env').config()
const browser = require('./browser')
const logger = util.createLogger('stats.route')

/**
 * Stats URL
 * Shows resources consumed by the Puppeteer process
 * Usage:
 *   curl http://localhost:3001/stats
 **/
exports.route = async (req, res) => {
  let puppeteerStats, snapDirSize, numSnapFiles
  puppeteerStats = await browser.stats()
  snapDirSize = await util.du(config.ABS_SNAP_DIR)

  // Todo: also list file names? Maybe at a different endpoint...
  const snapFiles = await fs.readdirSync(config.ABS_SNAP_DIR)
  numSnapFiles = snapFiles.length

  const usage = {
    puppeteerStats,
    snapDirSize,
    numSnapFiles
  }
  logger.info(usage)
  res.json(usage)
}
