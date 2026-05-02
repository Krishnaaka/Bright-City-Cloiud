#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# EC2 One-Time Bootstrap Script for Bright City Cloud
# Run this ONCE on your EC2 Ubuntu instance after first launch.
# Usage: chmod +x ec2-bootstrap.sh && sudo ./ec2-bootstrap.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo "🚀 Starting EC2 Bootstrap for BrightCity..."

# ── 1. System Updates ─────────────────────────────────────────────────────────
apt-get update -y
apt-get upgrade -y

# ── 2. Install Docker ─────────────────────────────────────────────────────────
apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow ubuntu user to run docker without sudo
usermod -aG docker ubuntu

# Enable Docker on startup
systemctl enable docker
systemctl start docker

# ── 3. Install AWS CLI v2 ──────────────────────────────────────────────────────
apt-get install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws/

# ── 4. Configure EC2 Instance Role (attach IAM role in AWS Console instead) ──
# EC2 should have an IAM Role with these policies attached:
#   - AmazonEC2ContainerRegistryReadOnly
# This allows docker pull from ECR without storing credentials on EC2.

# ── 5. Create app directory ────────────────────────────────────────────────────
mkdir -p /home/ubuntu/brightcity/monitoring/grafana/provisioning
chown -R ubuntu:ubuntu /home/ubuntu/brightcity

# ── 6. Open required EC2 Security Group ports (do this in AWS Console) ────────
# Port 22   — SSH
# Port 80   — Frontend (React)
# Port 8000 — Backend API
# Port 3000 — Grafana
# Port 9090 — Prometheus
# Port 9100 — Node Exporter
# Port 8080 — cAdvisor

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "⚠️  NEXT STEPS:"
echo "   1. Go to AWS Console → EC2 → Instances → Your Instance"
echo "   2. Actions → Security → Modify IAM Role"
echo "   3. Attach a role with 'AmazonEC2ContainerRegistryReadOnly' policy"
echo "   4. Open Security Group ports: 80, 8000, 3000, 9090"
echo "   5. Add GitHub Secrets (see github-secrets-guide.md)"
echo ""
echo "🔄 Please log out and log back in for docker group to apply."
