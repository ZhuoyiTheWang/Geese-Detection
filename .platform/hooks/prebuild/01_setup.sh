#!/bin/bash
# Create a custom temporary directory and set its permissions
sudo mkdir -p /mnt/large_tmp
sudo chmod 1777 /mnt/large_tmp

# Export TMPDIR so subsequent commands (like pip install) use it
export TMPDIR=/mnt/large_tmp
