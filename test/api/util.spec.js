// Packages
const fs = require('fs')
const url = require('url')
const winston = require('winston')
const expressWinston = require('express-winston')

// Testing utils
const sinon = require('sinon');
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(require('chai-like'))
chai.use(require('chai-things'))

// Mocking:
const config = require('../../api/env').config()

// Testing this:
const util = require('../../api/util')

describe('API Utilities', () => {
    afterEach(() => {
       delete process.env.NODE_ENV
    });

    describe('isProduction', () => {
        it('should return true when NODE_ENV is production', () => {
            process.env.NODE_ENV = 'production'
            assert.isTrue(util.isProduction());
        });

        it('should return false when NODE_ENV is not production', () => {
            process.env.NODE_ENV = 'fake'
            assert.isFalse(util.isProduction());
        });
    });

    describe('isDebug', () => {
        it('should return true when NODE_ENV is debug', () => {
            process.env.NODE_ENV = 'debug'
            assert.isTrue(util.isDebug());
        });

        it('should return false when NODE_ENV is not debug', () => {
            process.env.NODE_ENV = 'fake'
            assert.isFalse(util.isDebug());
        });
    });

    describe('isDebugging', () => {
        it('should return empty when NODE_ENV is not debug', () => {
            process.env.NODE_ENV = 'fake'
            assert.deepEqual(util.isDebugging(), {});
        });

        it('should return a debug object when NODE_ENV is debug', () => {
            process.env.NODE_ENV = 'debug'
            assert.notDeepEqual(util.isDebugging(), {});
        });
    });

    describe('createLogger', () => {
        it('should return an info-level Winston logger', () => {
            const logger = util.createLogger();
            assert.equal(logger.level, 'info')
        });

        it('should have a console transport', () => {
            const logger = util.createLogger();
            expect(logger.transports).to.be.an('array').that.contains.something.like({name: 'console'})
        });

        it('should not have a file transport', () => {
            process.env.NODE_ENV = 'debug'
            const logger = util.createLogger();
            expect(logger.transports).to.be.an('array').that.not.contains.something.like({name: 'file'})
        });

        describe('when NODE_ENV = production', () => {
            it('should have a combined.log file transport', () => {
                process.env.NODE_ENV = 'production'
                const logger = util.createLogger();
                expect(logger.transports)
                    .to.be.an('array')
                    .that.contains.something.like({name: 'file'})
                expect(logger.transports)
                    .to.be.an('array')
                    .that.contains.something.like({filename: 'combined.log'})
            });

            it('should have an error.log file transport', () => {
                process.env.NODE_ENV = 'production'
                const logger = util.createLogger();
                expect(logger.transports)
                    .to.be.an('array')
                    .that.contains.something.like({name: 'file'})
                expect(logger.transports)
                    .to.be.an('array')
                    .that.contains.something.like({filename: 'error.log'})
            });
        })
    });

    describe('createExpressLogger', () => {
        before(() => {
            sinon.stub(expressWinston, "logger").returns(3);
        });

        after(() => {
            expressWinston.logger.restore()
        });

        it('should return an ExpressWinston logger', () => {
            const logger = util.createExpressLogger();
            assert.equal(logger, 3)
        });
    });

    describe('buildFilename', () => {
        it('should throw on a bad Url object', () => {
            assert.throws(() => {
                util.buildFilename('badUrlObject')
            }, Error, 'Unexpected parsedUrl object')
        });

        it('should replace equals with underscores', () => {
            const path = '/calendar.png?key1=val1&key2=val2'
            const fileName = util.buildFilename(url.parse(path))
            expect(fileName).to.not.include('=')
            expect(fileName).to.include('_')
        });

        it('should prepend with the URL path', () => {
            const path = '/calendar.png?key1=val1&key2=val2'
            const fileName = util.buildFilename(url.parse(path))
            expect(fileName).to.satisfy(msg => msg.startsWith('calendar'));

        });

        it('should append with the URL file extension', () => {
            const path = '/calendar.png?key1=val1&key2=val2'
            const fileName = util.buildFilename(url.parse(path))
            expect(fileName).to.satisfy(msg => msg.endsWith('.png'));
        });
    });

    describe('buildFilepath', () => {
        it('should throw on a bad Url object', () => {
            assert.throws(() => {
                util.buildFilepath('badUrlObject')
            }, Error, 'Unexpected parsedUrl object')
        });

        it('should override the pathname', () => {
            const path = '/notcal.png?key1=val1&key2=val2'
            const filePath = util.buildFilepath(url.parse(path))
            expect(filePath).to.not.include('notcal-')
            expect(filePath).to.include('calendar-')
        });

        it('should include config.ABS_SNAP_DIR', () => {
            const path = '/?key1=val1&key2=val2'
            const filePath = util.buildFilepath(url.parse(path))
            expect(filePath).to.include(config.ABS_SNAP_DIR)
        });
    });

    describe('testSystem', () => {
        afterEach(() => {
            fs.accessSync.restore()
        });

        it('should throw if accessSync fails', () => {
            sinon.stub(fs, "accessSync").throws()
            assert.throws(() => {
                test = util.testSystem()
            }, Error, 'testSystem read/write error')
        });

        it('should return a boolean on success', () => {
            sinon.stub(fs, "accessSync").returns(true)
            assert.isTrue(util.testSystem())
        })
    });
});
