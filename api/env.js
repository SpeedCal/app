/**
 * API Configuration
 * Merges ENv, defaults, and adds complex overrides.
 * Usage:
 *   const config = require('./env').config()
 **/

const path = require('path')
require('dotenv').config()
const snapDir = process.env.REL_SNAP_DIR || '../snapshots'

exports.config = () => Object.assign(
  // Defaults:
  {
    REACT_APP_URL: 'localhost',
    REACT_APP_PORT: 3000,
    REACT_APP_API_PORT: 3001
  },

  // Environment settings:
  process.env,

  // Overrides:
  {
    ABS_SNAP_DIR: path.join(__dirname, snapDir),
  }
)
