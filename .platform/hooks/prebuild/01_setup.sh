#!/bin/bash
# Create a custom temporary directory and set its permissions
sudo mkdir -p /mnt/large_tmp
sudo chmod 1777 /mnt/large_tmp

# Ensure TMPDIR is globally set for all processes
echo "export TMPDIR=/mnt/large_tmp"
export TMPDIR=/mnt/large_tmp
/var/app/venv/staging-LQM1lest/bin/pip install --no-cache-dir -r /var/app/staging/requirements.txt