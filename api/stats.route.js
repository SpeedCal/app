const fs = require('fs')

const util = require('./util')
const config = require('./env').config()
const browser = require('./browser')

/**
 * Stats URL
 * Shows resources consumed by the Puppeteer process
 * Usage:
 *   curl http://localhost:3001/stats
 **/
exports.route = async (req, res) => {
  const logger = util.createLogger('stats.route')
  const puppeteerStats = await browser.stats()
  const snapDirSize = await util.du(config.ABS_SNAP_DIR)

  // Todo: also list file names? Maybe at a different endpoint...
  const snapFiles = await fs.readdirSync(config.ABS_SNAP_DIR)
  const numSnapFiles = snapFiles.length

  const usage = {
    puppeteerStats,
    snapDirSize,
    numSnapFiles
  }
  logger.info('stats', usage)
  return res.json(usage)
}
