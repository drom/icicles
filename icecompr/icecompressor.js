/*
  ECMAscript v5 version of
  #iceStorm bitstream compression library
  Derived from @cliffordwolf work
  #icestorm/icecompr/icecompr.cc
*/
'use strict';

var stream = require('stream');

function dumpToTheSwamp (swamp, frogs, value, bits) {
    // very slow bit-by-bit implementation
    // TODO touch the swamp at Byte rate
    var i, cursor, bcursor, pcursor, mask, update, byte;
    for (i = 0; i < bits; i++) {
        cursor = frogs + i;
        bcursor = cursor >> 3;
        pcursor = 7 - (cursor & 7);
        mask = ~(1 << pcursor) && 0xff;
        update = ((value >> (bits - i - 1)) & 1) << pcursor;
        byte = swamp[bcursor];
        swamp[bcursor] = (byte & mask) | update;
    }
}

function compressor () {

    var $ = stream.Transform();
    // parse STATE
    var numzeros = 0;
    // compress STATE
    var swamp = Buffer.alloc(0x1000);
    var frogs = 0; // [bits]

    function push_int_bits (value, bits) {
        var next, scratch, tail;

        scratch = 8 * swamp.length - frogs;
        if (scratch > bits) {
            dumpToTheSwamp(swamp, frogs, value, bits);
            frogs += bits;
        } else {
            tail = bits - scratch;
            dumpToTheSwamp(swamp, frogs, value >> scratch, tail);
            // drain the swamp
            $.push(swamp);
            dumpToTheSwamp(swamp, 0, value, scratch);
            frogs = tail;
        }
    }

    function parse (chunk) {
        var deltas = [];
        var i, ilen, byte, bit;
        for (i = 0, ilen = 8 * chunk.length; i < ilen; i++) {
            byte = chunk[i >> 3];
            bit = byte & (1 << (7 - (i & 7)));
            if (bit) {
                deltas.push(numzeros);
                numzeros = 0;
            } else {
                numzeros += 1;
            }
        }
        return deltas;
    }

    function compress (deltas) {
        var raw_len,
            compr_len,
            best_compr_raw_diff,
            best_compr_raw_idx,
            best_compr_raw_len,
            delta;

        var i, ilen, j, k;

        for (i = 0, ilen = deltas.length; i < ilen; i++) {
            raw_len = 0;
            compr_len = 0;
            best_compr_raw_diff = -1;
            best_compr_raw_idx = -1;
            best_compr_raw_len = -1;

            for (j = 0; (j + i) < ilen; j++) {
                delta = deltas[i + j];
                raw_len += delta + 1;
                if (delta < 4)          compr_len += 3;
                else if (delta < 32)    compr_len += 7;
                else if (delta < 256)   compr_len += 11;
                else                    compr_len += 26;

                if (((compr_len - raw_len) < Math.max(best_compr_raw_diff - 4, 0)) || (raw_len > 64)) {
                    break;
                }

                if ((compr_len - raw_len) > best_compr_raw_diff) {
                    best_compr_raw_diff = compr_len - raw_len;
                    best_compr_raw_idx = j;
                    best_compr_raw_len = raw_len;
                }
            }

            if (best_compr_raw_diff > 9) {
                // opcode_stats_raw++;

                push_int_bits(1, 4);
                push_int_bits(best_compr_raw_len - 1, 6);

                for (j = 0; j <= best_compr_raw_idx; j++) {
                    delta = deltas[i + j];
                    for (k = 0; k < delta; k++) {
                        push_int_bits(0, 1);
                    }
                    if (j < best_compr_raw_idx) {
                        push_int_bits(1, 1);
                    }
                }

                i += best_compr_raw_idx;
                continue;
            }

            delta = deltas[i];

            if (delta < 4) {
                // opcode_stats_d4++;
                push_int_bits(1, 1);
                push_int_bits(delta, 2);
            } else
            if (delta < 32) {
                // opcode_stats_d32++;
                push_int_bits(1, 2);
                push_int_bits(delta, 5);
            } else
            if (delta < 256) {
                // opcode_stats_d256++;
                push_int_bits(1, 3);
                push_int_bits(delta, 8);
            } else {
                // opcode_stats_d8M++;
                push_int_bits(1, 5);
                push_int_bits(delta, 23);
            }
        }
    }

    $.on('error', function (err) { /* TODO */ });

    $._transform = function (chunk, enc, next) {
        compress(parse(chunk));
        next();
    };

    $._flush = function (next) {
        push_int_bits(0, 5);
        push_int_bits(numzeros, 23);
        $.push(swamp.slice(0, (frogs + 7) >> 3));
        $.push(null);
        next();
    };

    $.push(Buffer.alloc(8, 'ICECOMPR', 'ascii'));

    return $;
}

module.exports = compressor;
