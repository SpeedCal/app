// Packages
const winston = require('winston')

// Chai utils
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(require('chai-like'))
chai.use(require('chai-things'))

// Testing this:
const util = require('../util')



describe('API Utilities', () => {
    afterEach(() => {
       delete process.env.NODE_ENV
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

    });

    describe('buildFilename', () => {

    });
    describe('buildFilepath', () => {

    });
    describe('testSystem', () => {

    });
    describe('cleanup', () => {

    });
});