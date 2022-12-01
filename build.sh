#!/bin/bash

if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
    if [ ! -d node_modules ]
    then
        podman run --rm -t -v $(pwd):/asciidoctor-revealjs:z docker.io/node:16 npm install --prefix /asciidoctor-revealjs
    fi
    podman run --rm -t -v $(pwd):/asciidoctor-revealjs:z docker.io/node:16 npm --prefix /asciidoctor-revealjs run build
fi
