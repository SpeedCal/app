// Packages
const fs = require('fs')
const url = require('url')

// Testing utils
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
const mockUrl = '/test.png?a=1'
const mockRequest = {
  _parsedUrl: url.parse(mockUrl)
}
const mockResponse = {
  json: sinon.spy(),
//  status: () => {
//    send: sinon.spy()
//  },
//  sendFile: sinon.spy()
}
const mockStats = sinon.spy()
const mockLogger = {
  info: sinon.spy()
}

// Testing this:
const stats = require('../../api/stats.route')

describe('API Route: Stats', () => {
  beforeEach(() => {
    sinon.stub(util, 'du').returns(9999)
    sinon.stub(fs, 'readdirSync').returns(['a', 'b', 'c'])
    sinon.stub(browser, 'stats').returns(mockStats)
    sinon.stub(util, 'createLogger').returns(mockLogger)
  });

  afterEach(() => {
    sinon.restore()
  });

  it('should get browser stats', async () => {
    await stats.route(mockRequest, mockResponse)
    sinon.assert.called(browser.stats)
  });

  it('should get snapshot directory disk usage', async () => {
    await stats.route(mockRequest, mockResponse)
    sinon.assert.calledWith(util.du, config.ABS_SNAP_DIR)
  });

  it('should get number of files in directory', async () => {
    await stats.route(mockRequest, mockResponse)
    sinon.assert.calledWith(fs.readdirSync, config.ABS_SNAP_DIR)
  });

  it('should send a JSON response', async () => {
    await stats.route(mockRequest, mockResponse)
    sinon.assert.called(mockResponse.json)
  });
});
