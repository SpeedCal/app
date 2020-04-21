/**
 * API Utilities
 * Usage:
 *   const util = require('./util')
 **/

const fs = require('fs')
const du = require('du')
const url = require('url')
const path = require('path')
const winston = require('winston')
const childProcess = require('child_process')
const expressWinston = require('express-winston')

const config = require('./env').config()

exports.isProduction = () => process.env.NODE_ENV === 'production'
exports.isDebug = () => process.env.NODE_ENV === 'debug'

/**
 * Debugging indicator
 * Returns Puppeteer options when NODE_ENV=debug
 **/
exports.isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo: 250,
    devtools: true,
  }
  return exports.isDebug() ? debugging_mode : {}
}

/**
 * Main logger creator
 * Accepts the name of a service during instantiation, ideally a filename
 **/
exports.createLogger = (serviceName='api') => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
  });

  // Always log to console
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));

  // If we're in production, also log to file
  if (process.env.NODE_ENV === 'production') {
      logger.add(new winston.transports.File({ filename: 'combined.log' }));
      logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  }

  return logger
}


/**
 * Express logger
 * Used for logging route activity
 **/
exports.createExpressLogger = () => {
  return expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{req.headers}} {{req.connection}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  })
}

/**
 * Builds a filename given a url.parse() object.
 * Translates query params into a suitable file name.
 * Might be better to use md5() to generate names in the future, but that
 * would obfuscate filenames and make development a bit harder.
 **/
exports.buildFilename = (parsedUrl) => {
  if(!(parsedUrl instanceof url.Url)){
    throw new Error('Unexpected parsedUrl object')
  }
  const parsedPath = path.parse(parsedUrl.pathname)
  const parsedQuery = parsedUrl.query ? parsedUrl.query.replace(/=/gi, '_') : ''
  const fileName = `${parsedPath.name}-${parsedQuery}${parsedPath.ext}`
  return fileName
}

exports.buildFilepath = (parsedUrl) => {
  if(!(parsedUrl instanceof url.Url)){
    throw new Error('Unexpected parsedUrl object')
  }
  // Hard-setting the URL path for now, maybe open it up in the future
  parsedUrl.pathname = 'calendar.png'
  const fileName = exports.buildFilename(parsedUrl)
  const filePath = path.join(__dirname, config.REL_SNAP_DIR, fileName)
  return filePath
}


/**
 * System startup tests
 * Ensure the environment is suitable for operating within.
 **/
exports.testSystem = () => {
  let success = true;

  try {
    fs.mkdirSync(config.ABS_SNAP_DIR, {recursive: true})
    fs.accessSync(config.ABS_SNAP_DIR, fs.constants.R_OK | fs.constants.W_OK)
  } catch(err){
    throw new Error(`testSystem read/write error: ensure directory exists: ${config.ABS_SNAP_DIR}`)
  }

  return success
}


exports.getFileBirthtime = (filePath) => {
  let birthTime = null

  try {
    const stat = fs.statSync(filePath)
    birthTime = stat.birthtime
  } catch(err) {
    // Todo: use logger?
    console.error('Error: util.getFileBirth :: ', err)
  }

  return birthTime
}

exports.du = async (sysPath) => {
  // Todo: figure out how to mock du()
  let stats = null

  try {
    stats = du(sysPath)
  } catch(err){
    // Todo: use logger?
    console.error('Error: util.du :: ', err)
  }

  return stats
}