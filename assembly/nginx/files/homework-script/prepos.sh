#!/bin/bash

rm -rf ./pre-pos-sec-1

git clone https://github.com/Lucky-LengYi/pre-pos-sec-1.git

rm -rf  specs

mv pre-pos-sec-1/specs ./

jasmine
