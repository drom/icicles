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

yosys -q -p "synth_ice40 -blif $N.blif" $N
arachne-pnr $N.blif -d 8k --post-place-blif $N.post.blif
yosys -q -o $N.post.json $N.post.blif
