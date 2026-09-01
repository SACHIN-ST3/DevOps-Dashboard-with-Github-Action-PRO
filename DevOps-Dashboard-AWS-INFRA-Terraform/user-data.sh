#!/bin/bash

set -e

exec > >(tee /var/log/devops-dashboard-user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting DevOps Dashboard EC2 setup..."

apt-get update -y

apt-get install -y \
    docker.io \
    docker-compose-v2 \
    curl \
    unzip

systemctl enable docker
systemctl start docker

usermod -aG docker ubuntu

echo "Docker installation completed."
echo "DevOps Dashboard EC2 setup completed."