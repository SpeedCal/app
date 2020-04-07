import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const du = require('du')
const fs = require('fs')
const url = require('url')
const path = require('path')
const winston = require('winston')
const pidusage = require('pidusage')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const expressWinston = require('express-winston')
const expAutoSan = require('express-autosanitizer')

// Globals
const APP_TITLE = 'React Calendar API'
const REL_SNAP_DIR = '../snapshots'
const ABS_SNAP_DIR = path.join(__dirname, REL_SNAP_DIR)

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo: 250,
    devtools: true,
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
});


// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
} else {
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
}

let browser, page;
const app = express();

app.use(cors());
app.use(expAutoSan.all)

app.use(expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}} {{req.headers}} {{req.connection}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));


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
    snapDirSize = await du(ABS_SNAP_DIR)

    // Todo: also list file names? Maybe at a different endpoint...
    const snapFiles = await fs.readdirSync(ABS_SNAP_DIR)
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
 * Builds a filename given a url.parse() object.
 * Translates query params into a suitable file name.
 * Might be better to use md5() to generate names in the future, but that
 * would obfuscate filenames and make development a bit harder.
 **/
function buildFilename(parsedUrl){
  const parsedPath = path.parse(parsedUrl.pathname)
  const parsedQuery = parsedUrl.query.replace(/=/gi, '_')
  const fileName = `${parsedPath.name}-${parsedQuery}${parsedPath.ext}`
  return fileName
}

function buildFilepath(parsedUrl){
  const fileName = buildFilename(parsedUrl)
  const filePath = path.join(__dirname, REL_SNAP_DIR, `calendar${fileName}.png`)
  return filePath
}


/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
app.get('/', async (req, res) => {
  const hrstart = process.hrtime()
  const filePath = buildFilepath(req._parsedUrl)

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
 * System startup tests
 * Ensure the environment is suitable for operating within.
 **/
function testSystem(){
  let success = true;

  try {
    fs.accessSync(ABS_SNAP_DIR, fs.constants.R_OK | fs.constants.W_OK)
  } catch(err){
    logger.error(`testSystem read/write error: ensure directory exists: ${ABS_SNAP_DIR}`)
    success = false
  }

  return success
}

/**
 * Server instantiation
 * Opens an empty Puppeteer instance so that incoming requests
 * don't have to start so cold.
 **/
const server = app.listen(process.env.API_PORT, async () => {
  if(!testSystem()){
    logger.error('Startup failure')
    process.exit()
  }

  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage();
  logger.info(`API listening on http://localhost:${process.env.API_PORT}`)
});


/**
 * Ensure Chromium is closed and the process restarts cleanly
 * for both user and nodemon exit signals
 **/
async function cleanup() {
  console.log('cleanup...')
  !!browser && await browser.close()
  server.close(() => process.kill(process.pid, 'SIGUSR2'))
}
process.once('exit', async () => await cleanup())
process.once('SIGUSR2', async () => await cleanup())
