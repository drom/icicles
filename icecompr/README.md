Bitstream compressor in JavaScript.

## Usage

### CLI

The tool can be used from unix command line.

```sh
./icecompr < mybitstream.bin > mybitstream.bin.compr
```

### Library

You can use compressor inside your JavaScript application:

```js
var icecompressor = require('./icecompressor');
var ic = icecompressor();
myReadStream.pipe(ic).pipe(myWriteStream);
```
