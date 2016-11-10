'use strict'

var util = require('util')

function ADSL (opts) {
  opts = opts || {}
  if (typeof opts.level === 'number') {
    opts.level = ADSL.levels[opts.level]
  }
  if (typeof opts.prefix === 'string') {
    var strPrefix = opts.prefix
    opts.prefix = function () { return strPrefix }
  }

  var logger = {}
  var level = opts.level || ADSL.defaultLevel
  var levelIndex = ADSL.levels.indexOf(level)
  var prefix = opts.prefix || function () {}

  var transports = []
    .concat(opts.transport || ADSL.defaultTransport)
    .map(function (transport) { return transport(level, levelIndex) })

  ADSL.levels.forEach(function (lvl, lvlIndex) {
    logger[lvl] = function () {
      var message = util.format.apply(util, arguments)

      transports.forEach(function (transport) {
        transport(message, prefix(lvl, lvlIndex), lvl, lvlIndex)
      })
    }
  })

  logger.log = logger.info

  return logger
}

ADSL.levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
ADSL.defaultLevel = 'info'
ADSL.defaultTransport = function (level, levelIndex) {
  var polyfill = {
    trace: console.info,
    debug: console.info,
    fatal: console.error
  }

  return function (message, prefix, lvl, lvlIndex) {
    lvlIndex >= levelIndex &&
      (console[lvl] || polyfill[lvl] || console.log)
        .call(console, prefix ? util.format(prefix, message) : message)
  }
}

module.exports = ADSL
