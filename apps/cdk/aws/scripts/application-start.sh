#!/bin/bash
set -xe

# Start the application server.
/usr/bin/pm2 start /home/ec2-user/ecosystem.config.js