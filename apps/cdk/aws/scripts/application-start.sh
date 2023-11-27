#!/bin/bash
set -xe

# Start the application server.
/usr/local/bin/docker-compose up -d /home/ec2-user/docker-compose.yml