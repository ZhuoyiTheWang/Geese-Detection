#!/bin/bash
# Create a custom temporary directory and set its permissions
sudo mkdir -p /mnt/large_tmp
sudo chmod 1777 /mnt/large_tmp

# Ensure TMPDIR is globally set for all processes
echo "export TMPDIR=/mnt/large_tmp" | sudo tee -a /etc/profile.d/tmpdir.sh
sudo chmod +x /etc/profile.d/tmpdir.sh
export TMPDIR=/mnt/large_tmp
