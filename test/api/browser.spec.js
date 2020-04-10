// Packages
const puppeteer = require('puppeteer')
//const pidusage = require('pidusage')

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
const mockBrowser = {
  newPage: () => {},
  process: () => {pid: 123},
  close: sinon.spy()
}
const mockPidusage = {
  cpu: 0.01,
  memory: 2,
  ppid: 3,
  pid: 4,
  ctime: 7900,
  elapsed: 1139273000,
  timestamp: 1586379986155
}
const mockPage = {
  goto: sinon.spy(),
  screenshot: sinon.spy()
}
const mockLogger = {
  info: sinon.spy(),
  error: sinon.spy()
}

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
      sinon.stub(browser.instance, "process").returns({pid: 123});
      sinon.stub(browser, "pidusage").returns(mockPidusage);
      const stats = await browser.stats()
      assert.equal(stats.pid, 4)
    });
  });

  describe('close', () => {
    describe('When an instance is set', () => {
      it('should call the close function', async () => {
        browser.instance = mockBrowser
        await browser.close()
        sinon.assert.called(mockBrowser.close)
      });
    });

    describe('When an instance is not set', () => {
      it('should not call the close function', async () => {
        browser.instance = false
        assert.doesNotThrow(async () => {
            await browser.close()
        }, Error)
      });
    });
  });

  describe('getBrowser', () => {
    it('should return the current browser instance', () => {
      mockBInstance = {name: 'testBrowser'}
      browser.instance = mockBInstance
      assert.deepEqual(browser.getBrowser(), mockBInstance)
    });
  });

  describe('getPage', () => {
    it('should return the current browser instance', () => {
      const mockPInstance = {name: 'testPage'}
      browser.page = mockPInstance
      assert.deepEqual(browser.getPage(), mockPInstance)
    });
  });

  describe('storeSnapshot', () => {
    const mockUrl = 'http://test.test'
    const mockPath = '/tmp/test'

    describe('When browser works', () => {
      beforeEach(() => {
        sinon.stub(browser, 'getPage').returns(mockPage)
        browser.logger = mockLogger
      });

      afterEach(() => {
        browser.getPage.restore()
      });

      it('should open the given URL', async () => {
        await browser.storeSnapshot(mockUrl, mockPath)
        sinon.assert.calledWith(mockPage.goto, mockUrl)
      });

      it('should store a screenshot at the given filePath', async () => {
        await browser.storeSnapshot(mockUrl, mockPath)
        sinon.assert.calledWith(mockPage.screenshot, {path: mockPath})
      });
    });

    /* Todo: figure out how to make this fail and handle the
       UnhandledPromiseRejectionWarning that shows up.

    describe('When browser fails', () => {
      beforeEach(() => {
        sinon.stub(browser, 'getPage').rejects()
        browser.logger = mockLogger
      });

      afterEach(() => {
        browser.getPage.restore()
      });

      it('should throw when getPage fails', async () => {
        assert.throws(async () => {
            await browser.storeSnapshot(mockUrl, mockPath)
        }, Error)
      });
    });
    */
  });
});
