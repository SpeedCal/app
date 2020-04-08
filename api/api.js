import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const du = require('du')
const fs = require('fs')
const url = require('url')
const path = require('path')
const pidusage = require('pidusage')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const expAutoSan = require('express-autosanitizer')

// Locals
const config = require('./env').config()
const util = require('./util')
const logger = util.createLogger()
const expressLogger = util.createExpressLogger()

// Instantiation
let browser, page;
const app = express();
app.use(cors());
app.use(expAutoSan.all)
app.use(expressLogger);


/**
 * Stats URL
 * Shows resources consumed by the Puppeteer process
 * Usage:
 *   curl http://localhost:3001/stats
 **/
app.get('/stats', async (req, res) => {
  let puppeteerStats, snapDirSize, numSnapFiles

  try{
    const proc = browser.process()
    puppeteerStats = await pidusage(proc.pid)
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
});


/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
app.get('/', async (req, res) => {
  const hrstart = process.hrtime()
  const filePath = util.buildFilepath(req._parsedUrl)

  if (!fs.existsSync(filePath)) {
    try {
      await page.goto(`http://localhost:${process.env.PORT}${req.url}`);
      await page.screenshot({path: filePath});
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
});


/**
 * Server instantiation
 * Opens an empty Puppeteer instance so that incoming requests
 * don't have to start so cold.
 **/
const server = app.listen(config.API_PORT, async () => {
  try {
    await util.testSystem()
  } catch(err) {
    logger.error('Startup failure :: ', err)
    process.exit()
  }

  browser = await puppeteer.launch(util.isDebugging())
  page = await browser.newPage();
  logger.info(`NODE_ENV = ${config.NODE_ENV}`)
  logger.info(`API listening on http://localhost:${config.API_PORT}`)
});


/**
 * Ensure Chromium is closed and the process restarts cleanly
 * for both user and nodemon exit signals
 **/
process.once('exit', async () => await util.cleanup(browser, server))
process.once('SIGUSR2', async () => await util.cleanup(browser, server))
