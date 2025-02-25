#!/bin/bash
# Ensure the folder exists
mkdir -p /var/app/staging/tmp
chmod 1777 /var/app/staging/tmp

# Export TMPDIR so pip uses /var/app/staging/tmp for temp files
export TMPDIR=/var/app/staging/tmp
echo "Using $TMPDIR for pip installs" >&2