#!/bin/bash
set -xe

# Start the application server.
/usr/local/bin/docker-compose -f /home/ec2-user/docker-compose.yml up -d