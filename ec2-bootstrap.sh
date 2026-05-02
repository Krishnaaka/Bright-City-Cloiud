#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# EC2 One-Time Bootstrap Script for Bright City Cloud
# Amazon Linux 2023 Edition
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo "🚀 Starting EC2 Bootstrap for BrightCity on Amazon Linux 2023..."

# ── 1. System Updates ─────────────────────────────────────────────────────────
dnf update -y

# ── 2. Install Docker ─────────────────────────────────────────────────────────
dnf install -y docker
systemctl enable docker
systemctl start docker

# Allow ec2-user to run docker without sudo
usermod -aG docker ec2-user

# ── 3. Install Docker Compose Plugin ──────────────────────────────────────────
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Verify
docker compose version

# ── 4. Install AWS CLI v2 (already on AL2023, but ensure latest) ──────────────
# AWS CLI is pre-installed on Amazon Linux 2023
aws --version

# ── 5. Install curl (for health checks) ──────────────────────────────────────
dnf install -y curl

# ── 6. Create app directory ────────────────────────────────────────────────────
mkdir -p /home/ec2-user/brightcity/monitoring/grafana/provisioning
chown -R ec2-user:ec2-user /home/ec2-user/brightcity

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "⚠️  NEXT STEPS:"
echo "   1. Attach IAM Role with 'AmazonEC2ContainerRegistryReadOnly' policy"
echo "   2. Open Security Group ports: 80, 8000, 3000, 9090"
echo "   3. Add GitHub Secret EC2_USER = ec2-user (NOT ubuntu!)"
echo ""
echo "🔄 Please log out and log back in for docker group to apply."
