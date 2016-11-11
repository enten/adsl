const adsl = require('.')
const colors = require('colors')
const fs = require('fs')
const os = require('os')

const styles = {
  trace: colors.grey,
  debug: colors.grey,
  info: colors.cyan,
  warn: colors.red,
  error: colors.bgRed,
  fatal: colors.bgRed
}

function colorsTransport (loggerLevel, loggerLevelNum) {
  const defaultTransport = adsl.defaultTransport(loggerLevel, loggerLevelNum)
  if (!colors.supportsColor) {
    return defaultTransport
  }
  return (message, prefix, level, levelIndex) => {
    defaultTransport(styles[level](message), prefix, level, levelIndex)
  }
}

function streamTransport (wstream, loggerLevel, loggerLevelNum) {
  return (message, prefix, level, levelNum) =>
    wstream.write(
      `${levelNum} ${new Date().toISOString()} ${prefix} ${message}${os.EOL}`)
}

var logWriteStream = fs.createWriteStream('log.txt')

const log = adsl({
  level: 'info',
  prefix(level) {
    return level.toUpperCase()
  },
  transport: [
    colorsTransport,
    streamTransport.bind(null, logWriteStream)
  ]
})

log.info('foo')
log.debug('bar')

logWriteStream.end(os.EOL)

// $ node example.js
// INFO foo
//
// $ cat log.txt
// 2 2016-11-11T04:59:53.539Z INFO foo
// 1 2016-11-11T04:59:53.540Z DEBUG bar
