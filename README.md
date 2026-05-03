# 🌆 Bright City Cloud

A full-stack web application designed with a robust, production-ready cloud architecture. This project showcases the integration of a modern React frontend and a FastAPI backend, fully containerized, automated via CI/CD, and monitored with industry-standard observability tools.

---

## 🛠️ Tech Stack & Architecture

### **Core Stack**
- **Frontend:** React.js, Vite, TailwindCSS
- **Backend:** FastAPI, Python, SQLAlchemy
- **Database:** PostgreSQL

### **DevOps & Cloud Infrastructure**
- **Containerization:** Docker & Docker Compose (7 distinct services)
- **CI/CD:** GitHub Actions
- **Container Registry:** AWS ECR (Elastic Container Registry)
- **Deployment:** AWS EC2 (Amazon Linux 2023)
- **Web Server / Proxy:** Nginx

### **Observability & Monitoring**
- **Metrics Collection:** Prometheus
- **Visualization:** Grafana
- **Server Metrics:** Node Exporter
- **Container Metrics:** cAdvisor

---

## 🏗️ What We Built

This repository isn't just an application; it is a fully functioning production environment. 

1. **Automated CI/CD Pipeline:** Every push to the `main` branch triggers a GitHub Action that builds the Frontend and Backend Docker images and securely pushes them to an AWS ECR repository.
2. **Container Orchestration:** A single `docker-compose.yml` flawlessly networks 7 containers:
   - React Frontend (Nginx Proxy)
   - FastAPI Backend
   - PostgreSQL Database
   - Prometheus
   - Grafana
   - cAdvisor
   - Node Exporter
3. **End-to-End Observability:** The FastAPI backend is instrumented using `prometheus-fastapi-instrumentator` to expose a `/metrics` endpoint. Prometheus scrapes this data (along with hardware metrics from Node Exporter and Docker metrics from cAdvisor) every 15 seconds.
4. **Automated Deployment Script:** A custom `deploy.sh` script automates pulling new images from AWS ECR, generating configuration files, and performing zero-downtime restarts on the EC2 instance.

---

## 🚀 How to Run Locally (Development)

If you want to run this application on your local machine for development, follow these steps:

### 1. Database Setup
Ensure you have PostgreSQL installed locally, or run a quick Postgres container:
```bash
docker run --name brightcity-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=brightcity_db -p 5432:5432 -d postgres:15-alpine
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

# Set the database URL for local dev
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/brightcity_db"

uvicorn main:app --reload --port 8000
```
The API will be running at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The website will be running at `http://localhost:5173`.

---

## 🌍 How to Deploy to Production (AWS EC2)

This project is configured for automated deployment to AWS.

### 1. GitHub Actions Setup
Ensure your repository has the following **GitHub Secrets** configured:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL`
- `SECRET_KEY`
- `GRAFANA_USER`
- `GRAFANA_PASSWORD`

*When you push code to `main`, GitHub Actions will build and push the Docker images to AWS ECR (`action-21` repository).*

### 2. EC2 Server Setup
SSH into your Amazon Linux 2023 EC2 instance. Ensure AWS credentials are configured via `aws configure`.

Run the deployment script:
```bash
bash ~/deploy.sh
```

**What the script does:**
1. Syncs the server clock to prevent AWS token rejection.
2. Automatically logs Docker into your private AWS ECR registry.
3. Provisions necessary configuration files for Prometheus (`prometheus.yml`) and Grafana.
4. Pulls the latest Docker images that GitHub Actions built.
5. Starts the entire stack using `docker compose up -d`.

### 3. Accessing the Live Server
Once deployed, the following services are available publicly (ensure your AWS Security Group allows traffic on these ports):

- 🌐 **Frontend App:** `http://<EC2-IP>/`
- 🔌 **Backend API:** `http://<EC2-IP>:8000/`
- 📊 **Grafana Dashboards:** `http://<EC2-IP>:3000/` *(Login: admin / brightcity2024)*
- 📈 **Prometheus:** `http://<EC2-IP>:9090/`

---

## 📈 Monitoring Dashboards

We utilize the public Grafana dashboard library. Once logged into Grafana on your server, click **Import** and use the following Dashboard IDs:

- **1860** - Node Exporter Full (EC2 Server CPU, RAM, Disk monitoring)
- **14282** - cAdvisor (Docker Container memory & network usage)
- **16867** - FastAPI Metrics (Backend response times & API traffic)
