#!/bin/bash
# 01_remount_tmp.sh
# This script remounts the /tmp filesystem with a larger size (10G) on instance startup.

echo "Remounting /tmp with size=10G" >&2

# Remount /tmp with a new size
mount -o remount,size=10G /tmp

# Check if the remount succeeded
if [ $? -eq 0 ]; then
  echo "/tmp successfully remounted with size=10G" >&2
else
  echo "Error: failed to remount /tmp" >&2
fi