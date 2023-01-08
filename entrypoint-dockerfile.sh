#!/bin/bash

export DBUS_SESSION_BUS_ADDRESS=$(dbus-daemon --session --fork --print-address 1)

Xvfb :0 $DPI_OPTIONS -screen 0 $XFB_SCREEN &

flaresolverr --no-sandbox
