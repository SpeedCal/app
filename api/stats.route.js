const fs = require('fs')
const du = require('du')
const pidusage = require('pidusage')

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

  try{
    puppeteerStats = await browser.stats()
    snapDirSize = await du(config.ABS_SNAP_DIR)

    // Todo: also list file names? Maybe at a different endpoint...
    const snapFiles = await fs.readdirSync(config.ABS_SNAP_DIR)
    numSnapFiles = snapFiles.length
  } catch(err){
    logger.error('stats :: ', err)
    res.status(500).send({message: 'Error collecting stats'})
  }

  const usage = {
    puppeteerStats,
    snapDirSize,
    numSnapFiles
  }
  logger.info(usage)
  res.json(usage)
}
