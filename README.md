# adsl

> Another dead simple logger inspired by the awesome [console-log-level](https://github.com/watson/console-log-level).


A dead simple logger. Will [log to STDOUT or STDERR depending on the
chosen log level](https://github.com/enten/adsl/blob/master/index.js#L59). It uses `console.info`, `console.warn` and
`console.error` and hence supports the same API.

Log levels supported: [trace, debug, info, warn, error and fatal](https://github.com/enten/adsl/blob/master/index.js#L57).

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

function colorsTransport (styles, msg, shouldLog, lvl, lvlIndex) {
  if (colors.supportsColor && styles[lvl]) {
    msg = styles[lvl](msg)
  }
  return adsl.defaultTransport(msg, shouldLog, lvl, lvlIndex)
}

function streamTransport (wstream, msg, shouldLog, level, levelIndex) {
  wstream.write(`${levelIndex} ${new Date} ${msg}${os.EOL}`)
}

var logWriteStream = fs.createWriteStream('log.txt')

const log = adsl({
  level: 'info',
  prefix(level) {
    return level.toUpperCase()
  },
  transport: [
    streamTransport.bind(null, logWriteStream),
    colorsTransport.bind(null, {
      trace: colors.grey,
      debug: colors.grey,
      info: colors.cyan,
      warn: colors.red,
      error: colors.bgRed,
      fatal: colors.bgRed
    })
  ]
})

log.info('current level:', log.level, log.levelIndex)
log.info('visible')
log.debug('invisible')

log.level = 'debug'

log.info('current level:', log.level, log.levelIndex)
log.info('foo')
log.debug('bar')

logWriteStream.end(os.EOL)

```

## Options

Configure the logger by passing an options object:

```js
var log = require('adsl')({
  level: 'info',
  prefix: function (level) {
    return level.toUpperCase()
  },
  defaultTransport: function (msg, shouldLog, lvl, lvlIndex) {
    if (shouldLog) {
      console.log(lvlIndex, lvl, msg)
    }
  }
})
```

### level

A `string` to specify the log level.

Defaults to :
[`adsl.defaultLevel`](https://github.com/enten/adsl/blob/master/index.js#L58) = `info`

### prefix

Specify this option if you want to set a prefix for all log messages.
This must be a `string` or a `function` that returns a string.

### transport

Function called by the logger at each logging operation.
This must be a `function` or an `array` of functions.

Defaults to : [`adsl.defaultTransport`](https://github.com/enten/adsl/blob/master/index.js#L64) =

```javascript
function (msg, shouldLog, lvl, lvlIndex) {
  shouldLog &&
    (console[ADSL.outputMap[lvl] || lvl] || console.log).call(console, msg)
}
```

## License

MIT
