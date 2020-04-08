const du = require('du')
const fs = require('fs')
const url = require('url')
const path = require('path')
const cors = require('cors')
const express = require('express')
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
//let browser, page;
const app = express();
app.use(cors());
app.use(expAutoSan.all)
app.use(expressLogger);

const browser = require('./browser')
const slash = require('./slash.route')
const stats = require('./stats.route')




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
  app.get('/', slash.route)
  app.get('/stats', stats.route);
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
