#!/bin/bash

N="main"

while [[ $# -gt 1 ]]
do
key="$1"
case $key in
  -n|--name)
  N="$2"
  shift
  ;;
  *)
  ;;
esac
shift
done

yosys -q -p "read_verilog -sv $N ; synth_ice40 -blif $N.blif"
arachne-pnr $N.blif -d 8k -P tq144:4k --post-place-blif $N.post.blif -o $N.asc
icetime -j $N.sta.json -d hx8k $N.asc
yosys -q -o $N.post.json $N.post.blif
