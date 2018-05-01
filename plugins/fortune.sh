#!/bin/bash
case $1 in
    "help")
        echo 'Returns a fortune'
        ;;
    *)
        fortune -a
        ;;
esac
