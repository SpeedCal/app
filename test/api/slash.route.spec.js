// Packages
const fs = require('fs')
const url = require('url')

// Testing utils
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(require('chai-like'))
chai.use(require('chai-things'))
chai.use(require("sinon-chai"))

// Mocking:
const util = require('../../api/util')
const config = require('../../api/env').config()
const browser = require('../../api/browser')
const mockRequest = {
  _parsedUrl: 
}
const mockResponse = {

}
//const logger = util.createLogger('stats.route')

// Testing this:
const slash = require('../../api/slash.route')

describe('API Route: Slash', () => {
  it('should create a browser object', async () => {
    await browser.init()
    assert.deepEqual(browser.getBrowser(), mockBrowser)
  });
});