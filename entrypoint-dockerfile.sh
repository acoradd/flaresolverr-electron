#!/bin/bash
Xvfb :0 $DPI_OPTIONS -screen 0 $XFB_SCREEN &

flaresolverr --no-sandbox
