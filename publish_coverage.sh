#!/bin/bash

if [ -d "coverage" ]; then
  bash <(curl -s https://codecov.io/bash) -s ./coverage -Z -v
else
  echo "No coverage generated. Skipping upload."
fi