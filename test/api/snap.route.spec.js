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
  set: sinon.spy(),
  sendFile: sinon.spy()
}
const mockStoreSnapshot = sinon.spy()

// Testing this:
const snap = require('../../api/snap.route')

describe('API Route: Snap', () => {
  beforeEach(() => {
    sinon.stub(util, 'buildFilepath').returns('/tmp/test')
    sinon.stub(util, 'getFileBirthtime').returns(5)
    sinon.stub(browser, 'storeSnapshot').returns(mockStoreSnapshot)
  });

  afterEach(() => {
    sinon.restore()
  });

  describe('When the file exists', () => {
    beforeEach(() => {
      sinon.stub(fs, 'existsSync').returns(true)
    });

    it('should not take a screenshot', async () => {
      await snap.route(mockRequest, mockResponse)
      sinon.assert.notCalled(browser.storeSnapshot)
    });

    it('should return a file', async () => {
      await snap.route(mockRequest, mockResponse)
      sinon.assert.calledWith(mockResponse.sendFile, '/tmp/test')
    });

    it('should set a rendertime header', async () => {
      await snap.route(mockRequest, mockResponse)
      sinon.assert.calledWith(mockResponse.set, 'X-RCA-rendertime-ms')
    });

    it('should set a birthtime header', async () => {
      await snap.route(mockRequest, mockResponse)
      sinon.assert.calledWith(mockResponse.set, 'X-RCA-birthtime', 5)
    });
  });

  describe('When file does not exist', () => {
    beforeEach(() => {
      sinon.stub(fs, 'existsSync').returns(false)
    });

    it('should take a screenshot', async () => {
      await snap.route(mockRequest, mockResponse)
      sinon.assert.called(browser.storeSnapshot)
    });
  });
});
