#!/bin/bash

mkdir build

rm -rf build/*

clang++ -std=c++11 ~/work/github/cliffordwolf/icestorm/icecompr/icecompr.cc -o icecompr

for fname in *.bin
do
  python3 ~/work/github/cliffordwolf/icestorm/icecompr/icecompr.py < $fname > build/$fname.py.compr
  ./icecompr < $fname > build/$fname.cc.compr
  ../icecompr.js < $fname > build/$fname.js.compr

  xxd $fname                build/$fname.hex
  xxd build/$fname.cc.compr build/$fname.cc.compr.hex
  xxd build/$fname.py.compr build/$fname.py.compr.hex
  xxd build/$fname.js.compr build/$fname.js.compr.hex

  echo "-------------------------------------------------------"
  echo $fname
#  cat  build/$fname.hex
#  cat  build/$fname.cc.compr.hex
  diff build/$fname.cc.compr build/$fname.py.compr
  diff build/$fname.cc.compr build/$fname.js.compr
  diff build/$fname.cc.compr.hex build/$fname.js.compr.hex
done
