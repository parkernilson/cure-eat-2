#!/bin/bash
set -xe

aws s3 cp s3://cureeat-deploy-bucket/docker-compose.yml /home/ec2-user/docker-compose.yml
