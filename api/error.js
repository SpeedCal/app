const util = require('./util')
const logger = util.createLogger('error')

exports.types = {
  // Todo: define some custom error types?
}

exports.handler = (err, req, res, next) => {
  logger.error(err)

  if (err.message === 'access denied') {
    res.status(403)
  }

  res.status(500)
  res.json({ error: err.message })
  next(err)
}
