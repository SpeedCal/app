const du = require('du')
const fs = require('fs')
const url = require('url')
const path = require('path')
const cors = require('cors')
const express = require('express')
const pidusage = require('pidusage')
const puppeteer = require('puppeteer')
const expAutoSan = require('express-autosanitizer')
require('express-async-errors')

// Locals
const config = require('./env').config()
const util = require('./util')
const error = require('./error')
const browser = require('./browser')
const snap = require('./snap.route')
const slash = require('./slash.route')
const stats = require('./stats.route')
const logger = util.createLogger()
const expressLogger = util.createExpressLogger()

// Instantiation
const router = express.Router();
const app = express();
app.use(cors());
app.use(expAutoSan.all)
app.use(expressLogger);

/**
 * Server instantiation
 * Opens an empty Puppeteer instance so that incoming requests
 * don't have to start so cold.
 **/
const listener = async () => {
  try {
    await util.testSystem()
  } catch(err) {
    logger.error('Startup failure :: ', err)
    process.exit()
  }

  await browser.init()
  logger.info(`NODE_ENV = ${config.NODE_ENV}`)
  logger.info(`API listening on http://localhost:${config.API_PORT}`)

  // Public routes:
  router.get('/', slash.route);
  app.use('/', router);

  router.get('/snap', snap.route);
  app.use('/snap', router);

  router.get('/stats', stats.route);
  app.use('/stats', router);

  //General error handler
  app.use(error.handler);
}



const server = app.listen(config.API_PORT, async () => listener())


/**
 * Ensure Chromium is closed and the process restarts cleanly
 * for both user and nodemon exit signals
 **/
const cleanup = async () => {
  await browser.close()
  await server.close()
}
process.once('exit', async () => await cleanup())
process.once('SIGUSR2', async () => await cleanup())
