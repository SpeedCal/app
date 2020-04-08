const puppeteer = require('puppeteer')
const pidusage = require('pidusage')

const util = require('./util')
let browser, page

exports.init = async () => {
  browser = await puppeteer.launch(util.isDebugging())
  page = await browser.newPage()
}

exports.stats = async () => {
  const proc = browser.process()
  const usage = await pidusage(proc.pid)
  return usage
}

exports.close = async () => {
  !!browser && await browser.close()
}

exports.getBrowser = () => {
  return browser
}

exports.getPage = () => {
  return page
}
