// Packages
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
const mockRequest = {
  _parsedUrl: url.parse('/')
}
const mockResponse = {
  json: sinon.spy()
}

// Testing this:
const slash = require('../../api/slash.route')

describe('API Route: Slash', () => {
  it('should return some JSON versions', async () => {
    await slash.route(mockRequest, mockResponse)
    sinon.assert.called(mockResponse.json)
  });
});
