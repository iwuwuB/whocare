#!/bin/bash

if [ $# -lt 0 ] || [ $# -gt 2 ] ; then
	exit 0;
fi

index=('jq' 'rt' 'ng');

ln -sf index.${index[$1]}.html index.html

