// Packages
const puppeteer = require('puppeteer')
const pidusage = require('pidusage')

// Testing utils
const proxyquire = require('proxyquire')
const sinon = require('sinon');
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(require('chai-like'))
chai.use(require('chai-things'))

// Mocking:
//const util = require('../../api/util')
const mockProcess = {
  pid: 123
}
const mockBrowser = {
  newPage: () => {},
  process: mockProcess
}
const pidusageMock = sinon.stub();
const Browser = proxyquire('../../api/browser', {
  'pidusage': pidusageMock
})


// Testing this:
const browser = require('../../api/browser')

describe('API Browser', () => {
  describe('init', () => {
    afterEach(() => {
      puppeteer.launch.restore()
    });

    it('should create a browser object', async () => {
      sinon.stub(puppeteer, "launch").returns(mockBrowser);
      await browser.init()
      assert.deepEqual(browser.getBrowser(), mockBrowser)
    });

    it('should create a newPage object', async () => {
      sinon.stub(puppeteer, "launch").returns(mockBrowser);
      await browser.init()
      assert.deepEqual(browser.getPage(), mockBrowser.newPage())
    });
  });

  describe('stats', () => {
    it('should return a pidusage report', async () => {
      sinon.stub(browser, "process").returns(mockProcess);
      sinon.stub(pidusage).returns((pid) => {report: pid});
      const stats = await browser.stats()
      
    });
  });

  describe('close', () => {
    it('should x', () => {

    });
  });

  describe('getBrowser', () => {
    it('should x', () => {

    });
  });

  describe('getPage', () => {
    it('should x', () => {

    });
  });
});
