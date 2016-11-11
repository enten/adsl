# adsl

> Another dead simple logger based on the awesome [console-log-level](https://github.com/watson/console-log-level).


A dead simple logger. Will log to STDOUT or STDERR depending on the
chosen log level. It uses `console.info`, `console.warn` and
`console.error` and hence supports the same API.

Log levels supported: trace, debug, info, warn, error and fatal.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install adsl
```

## Example usage

```js
// example.js
const adsl = require('adsl')
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
  prefix: level => level.toUpperCase(),
  transport: [
    colorsTransport,
    streamTransport.bind(null, logWriteStream)
  ]
})

log.info('foo')
log.debug('bar')

// $ node example.js
// INFO foo
//
// $ cat log.txt
// 2 2016-11-11T04:59:53.539Z INFO foo
// 1 2016-11-11T04:59:53.540Z DEBUG bar
```

## Options

Configure the logger by passing an options object:

```js
var log = require('adsl')({
  level: 'info',
  prefix: (level) => level.toUpperCase(),
  transport(loggerLevel, loggerLevelNum) {
    return function(msg, prefix, msgLevel, msgLevelNum) {
      console.log(msgLevelNum, prefix, msg)
    }
  }
})
```

### level

A `string` to specify the log level.

Defaults to :
[`require('adsl').defaultLevel`](https://github.com/enten/adsl/blob/master/index.js#L42) = `info`

### prefix

Specify this option if you want to set a prefix for all log messages.
This must be a `string` or a `function` that returns a string.

## transport

Hight-order function which returns message output handler.
This must be a `function` or an `array` of functions.

Defaults to : [`require('adsl').defaultTransport`](https://github.com/enten/adsl/blob/master/index.js#L43)

## License

MIT
