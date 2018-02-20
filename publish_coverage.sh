#!/bin/bash

if [ -d "coverage" ]; then
  bash <(curl -s https://codecov.io/bash)
else
  echo "No coverage generated. Skipping upload."
fi