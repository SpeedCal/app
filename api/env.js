/**
 * API Configuration
 * Merges ENv, defaults, and adds complex overrides.
 * Usage:
 *   const config = require('./env').config()
 **/

const path = require('path')
require('dotenv-defaults').config()

exports.config = () => Object.assign({}, process.env, {
  ABS_SNAP_DIR: path.join(__dirname, process.env.REL_SNAP_DIR),
})
