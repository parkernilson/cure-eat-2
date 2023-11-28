#!/bin/bash
set -xe

aws s3 cp s3://cureeat-deploy-bucket/docker-compose.yml /home/ec2-user/docker-compose.yml
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 445044180652.dkr.ecr.us-west-1.amazonaws.com
docker-compose -f /home/ec2-user/docker-compose.yml pull