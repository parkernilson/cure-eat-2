#!/bin/bash
set -xe

aws s3 cp s3://cureeat-deploy-bucket/build/ /home/ec2-user/build/ --recursive
