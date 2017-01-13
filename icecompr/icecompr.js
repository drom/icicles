#!/usr/bin/env node
'use strict';

var compressor = require('./icecompressor');

var c = compressor();

if (process.stdin.isTTY) {
    c.push('compressor v0.0.1\n');
}

process.stdin.pipe(c).pipe(process.stdout);
