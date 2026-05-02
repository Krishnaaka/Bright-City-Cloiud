#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  BrightCity — Full Stack Deploy Script for EC2
#  Run this on EC2 after GitHub Actions pushes images to ECR
#  Usage: bash deploy.sh
# ═══════════════════════════════════════════════════════════════════

set -e   # stop script immediately if any command fails

ECR_REGISTRY="700918785571.dkr.ecr.ap-south-1.amazonaws.com"
ECR_REPO="action-21"
APP_DIR="/home/ec2-user/brightcity"
REGION="ap-south-1"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   BrightCity — EC2 Deploy Starting...   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── STEP 1: Sync system clock ──────────────────────────────────────
echo "⏰ Step 1/7 — Syncing system clock..."
sudo chronyc makestep 2>/dev/null || true
echo "   ✅ Clock synced: $(date)"

# ── STEP 2: Clear any old broken AWS credentials ───────────────────
echo ""
echo "🔑 Step 2/7 — Clearing stale AWS credentials..."
rm -f ~/.aws/credentials ~/.aws/config
echo "   ✅ Using EC2 IAM Role for authentication"

# ── STEP 3: Login to ECR ───────────────────────────────────────────
echo ""
echo "🔐 Step 3/7 — Logging in to Amazon ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY
echo "   ✅ ECR Login successful"

# ── STEP 4: Setup app directory & config files ─────────────────────
echo ""
echo "📁 Step 4/7 — Setting up app directory and config files..."
mkdir -p $APP_DIR/monitoring/grafana/provisioning/datasources
mkdir -p $APP_DIR/monitoring/grafana/provisioning/dashboards

# Write prometheus.yml
cat > $APP_DIR/monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    env: "production"
    app: "brightcity"

scrape_configs:
  - job_name: "brightcity-backend"
    static_configs:
      - targets: ["backend:8000"]
    metrics_path: "/metrics"

  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "cadvisor"
    static_configs:
      - targets: ["cadvisor:8080"]
EOF

# Write Grafana datasource
cat > $APP_DIR/monitoring/grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
    jsonData:
      timeInterval: "15s"
EOF

# Write Grafana dashboard provisioning
cat > $APP_DIR/monitoring/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1
providers:
  - name: "BrightCity Dashboards"
    orgId: 1
    folder: "BrightCity"
    type: file
    disableDeletion: false
    editable: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Write docker-compose.yml
cat > $APP_DIR/docker-compose.yml << 'EOF'
services:

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-brightcity_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-brightcity_password}
      POSTGRES_DB: ${POSTGRES_DB:-brightcity_db}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brightcity_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ${ECR_REGISTRY:-700918785571.dkr.ecr.ap-south-1.amazonaws.com}/${ECR_REPO:-action-21}:backend-latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: ${DATABASE_URL:-postgresql://brightcity_user:brightcity_password@db:5432/brightcity_db}
      SECRET_KEY: ${SECRET_KEY:-changeme123}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_network

  frontend:
    image: ${ECR_REGISTRY:-700918785571.dkr.ecr.ap-south-1.amazonaws.com}/${ECR_REPO:-action-21}:frontend-latest
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app_network

  prometheus:
    image: prom/prometheus:v2.50.1
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=15d"
    networks:
      - app_network

  grafana:
    image: grafana/grafana:10.3.1
    restart: always
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_USER: ${GRAFANA_USER:-admin}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-brightcity2024}
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
    depends_on:
      - prometheus
    networks:
      - app_network

  node-exporter:
    image: prom/node-exporter:v1.7.0
    restart: always
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    networks:
      - app_network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - app_network

networks:
  app_network:
    driver: bridge

volumes:
  postgres_data:
  prometheus_data:
  grafana_data:
EOF

# Write .env file
cat > $APP_DIR/.env << 'EOF'
ECR_REGISTRY=700918785571.dkr.ecr.ap-south-1.amazonaws.com
ECR_REPO=action-21
POSTGRES_USER=brightcity_user
POSTGRES_PASSWORD=brightcity_password
POSTGRES_DB=brightcity_db
DATABASE_URL=postgresql://brightcity_user:brightcity_password@db:5432/brightcity_db
SECRET_KEY=brightcity-secret-key-2024
GRAFANA_USER=admin
GRAFANA_PASSWORD=brightcity2024
EOF

echo "   ✅ All config files created"

# ── STEP 5: Pull latest images from ECR ───────────────────────────
echo ""
echo "📦 Step 5/7 — Pulling latest Docker images from ECR..."
cd $APP_DIR
docker compose pull
echo "   ✅ Images pulled"

# ── STEP 6: Start all services ─────────────────────────────────────
echo ""
echo "🚀 Step 6/7 — Starting all services..."
docker compose up -d --remove-orphans
docker image prune -f > /dev/null 2>&1
echo "   ✅ All services started"

# ── STEP 7: Health check ───────────────────────────────────────────
echo ""
echo "🩺 Step 7/7 — Checking service health..."
sleep 15

echo "   Checking services..."
docker compose ps

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  🎉 DEPLOY COMPLETE!                        ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🌐 Frontend    →  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/"
echo "║  🔌 Backend     →  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000/"
echo "║  📊 Grafana     →  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000/  (admin / brightcity2024)"
echo "║  📈 Prometheus  →  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):9090/"
echo "╚══════════════════════════════════════════════════════════════╝"
