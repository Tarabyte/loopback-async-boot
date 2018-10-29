# loopback-async-boot

Higher order function to use async functions as loopback boot scripts.

## Usage

```
// boot/script.js
const handler = require('loopback-async-boot');

module.exports = handler(async(app) => {
  await ...
});
```
