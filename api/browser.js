"use strict";
const puppeteer = require('puppeteer')
const pidusage = require('pidusage')

const util = require('./util')
const config = require('./env').config()

class Browser {
  constructor(){
    this.instance = null
    this.page = null
    this.pidusage = pidusage
    this.logger = util.createLogger('browser')
  }

  getPuppeteerOpts(){
    return util.isProduction() ?
      {
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      } :
      {
        headless: false,
        slowMo: 250,
        devtools: true,
      }
  }

  async init(){
    try{
      this.instance = await puppeteer.launch(this.getPuppeteerOpts())
      this.page = await this.instance.newPage()
    } catch(err) {
      this.logger.error(err)
      throw new Error(err)
    }
  }

  async stats(){
    const proc = this.instance.process()
    const usage = await this.pidusage(proc.pid)
    return usage
  }

  async close(){
    !!this.instance && await this.instance.close()
  }

  getBrowser(){
    return this.instance
  }

  getPage(){
    return this.page
  }

  async storeSnapshot(url, filePath){
    try {
      await this.getPage().goto(url);
      await this.getPage().screenshot({path: filePath});
      this.logger.info(`Generating new snapshot: ${filePath}`)
    } catch(err) {
      this.logger.error('browser.storeSnapshot :: ', err)
      throw new Error(err)
    }
  }
}

module.exports = new Browser();
