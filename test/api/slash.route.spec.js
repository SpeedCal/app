// Packages
const fs = require('fs')
const url = require('url')

// Testing utils
//const proxyquire = require('proxyquire').noCallThru()
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
  set: sinon.spy(),
  status: () => {
    send: sinon.spy()
  },
  sendFile: sinon.spy()
}
const mockLogger = {
  info: () => {},
  error: () => {}
}
const mockGetPage = {
    goto: sinon.spy(),
    screenshot: sinon.spy(),
}
const mockStatSync = {birthtime: 5}
//const mockBrowser = {
//  getPage: () => mockGetPage
//}
//const logger = util.createLogger('stats.route')

// Testing this:
const slash = require('../../api/slash.route')

describe.only('API Route: Slash', () => {
  beforeEach(() => {
    sinon.stub(util, 'createLogger').returns(mockLogger)
    sinon.stub(util, 'buildFilepath').returns(mockLogger)
    sinon.stub(browser, 'getPage').returns(mockGetPage)
    sinon.stub(process, 'hrtime')
    sinon.stub(fs, 'existsSync').returns(false)
    sinon.stub(fs, 'statSync').returns(mockStatSync)
    
  });

  afterEach(() => {
    sinon.restore()
  })

  it.only('should return a file', async () => {
    await slash.route(mockRequest, mockResponse)
    sinon.assert.called(mockResponse.sendFile)
  });

  it('should set a rendertime header', async () => {
    //const res = await slash.route(mockRequest, mockResponse)
    //console.log('res? ', res)
  });

  it('should set a birthtime header', async () => {
    //const res = await slash.route(mockRequest, mockResponse)
    //console.log('res? ', res)
  });

  describe('When fs.statSync fails', () => {
    it('should throw', async () => {

    });
  });


  describe('When file does not exist', () => {
    beforeEach(() => {
      sinon.stub(fs, 'existsSync').returns(false)
    });

    it('should take a screenshot', async () => {

    });

    describe('When the screenshot fails', () => {
      it('should throw', async () => {

      });

      it('should return a 500 status', async () => {

      });
    });
  });
});
