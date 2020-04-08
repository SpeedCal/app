"use strict";
const puppeteer = require('puppeteer')
const pidusage = require('pidusage')

const util = require('./util')

class Browser {
  constructor(){
    this.instance = null
    this.page = null
    this.pidusage = pidusage
  }

  async init(){
    this.instance = await puppeteer.launch(util.isDebugging())
    this.page = await this.instance.newPage()
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
}

module.exports = new Browser();
