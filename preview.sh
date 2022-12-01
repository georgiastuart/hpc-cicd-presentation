#!/bin/bash

if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
    x-www-browser file://$(pwd)/public/index.html
fi
