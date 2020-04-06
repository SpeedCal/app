import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const fs = require('fs')
const url = require('url')
const path = require('path')
const winston = require('winston')
const pidusage = require('pidusage')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const expressWinston = require('express-winston')
const expAutoSan = require('express-autosanitizer')

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

//
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
  const proc = browser.process()
  const usage = await pidusage(proc.pid)
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

/**
 * Raw image URL
 * Serves an image after translating GET params into a filename.
 **/
app.get('/calendar.png', async (req, res) => {
  const fileName = buildFilename(req._parsedUrl)
  const filePath = path.join(__dirname, '../snapshots', fileName)

  try {
    if (fs.existsSync(filePath)) {
      // Todo: add headers for generation date and other useful meta
      res.sendFile(filePath)
    } else {
      logger.error('Requested file not found', filePath)
      res.status(404).send({message: 'File not generated'})
    }
  } catch(err) {
    logger.error('fs.existsSync error', err)
    res.status(500).send({message: 'Filesystem error'})
  }
});

app.get('/', async (req, res) => {
  await page.goto(`http://localhost:${process.env.PORT}${req.url}`);

  const fileName = buildFilename(req._parsedUrl)
  await page.screenshot({path: `snapshots/calendar${fileName}.png`});

  // Todo: try/catch for err
  // Todo: 301 to generated snapshot
  res.send('Hello World!');
});

const server = app.listen(process.env.API_PORT, async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage();
  logger.info(`API listening on http://localhost:${process.env.API_PORT}`)
});



async function cleanup() {
  console.log('cleanup...')
  !!browser && await browser.close()
  server.close(() => process.kill(process.pid, 'SIGUSR2'))
}
process.once('exit', async () => await cleanup())
process.once('SIGUSR2', async () => await cleanup())
