Bitstream compressor in JavaScript.

Original compression algorithm and C/Python implementation is here: https://github.com/cliffordwolf/icestorm/tree/master/icecompr

## Usage

### CLI

The tool can be used from unix command line.

```sh
./icecompr.js < mybitstream.bin > mybitstream.bin.compr
```

### Library

You can use compressor inside your JavaScript application:

```js
var icecompressor = require('./icecompressor');
var ic = icecompressor();
myReadStream.pipe(ic).pipe(myWriteStream);
```
