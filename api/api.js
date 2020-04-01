import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const url = require('url')
const winston = require('winston')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const expressWinston = require('express-winston')
const pidusage = require('pidusage')

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

app.use(expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}} {{req.headers}} {{req.connection}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));


app.get('/stats', async (req, res) => {
  const proc = browser.process()
  const usage = await pidusage(proc.pid)
  logger.info(usage)
  res.json(usage)
});

app.get('*', async (req, res) => {
  await page.goto(`http://localhost:${process.env.PORT}${req.url}`);
  await page.screenshot({path: 'snapshots/example.png'});

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
