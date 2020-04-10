// Packages
//const winston = require('winston')
//const expressWinston = require('express-winston')
const express = require('express')
const puppeteer = require('puppeteer')

// Testing utils
const sinon = require('sinon');
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(require('chai-like'))
chai.use(require('chai-things'))

// Global mocks
//sinon.stub(puppeteer, "launch").returns({
//    newPage: async () => {console.log('hi newpage')}
//});


// Testing this:
//const api = require('../../api/api')


describe('API', () => {
   assert.equal(1, 1) 
});