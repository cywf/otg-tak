# OTG-TAK Installation Guide

## System Requirements

### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB
- **OS**: Ubuntu 22.04 LTS (recommended) or similar Linux distribution

### Recommended Requirements
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 100GB+ SSD
- **Network**: 100Mbps+ connection

### Software Dependencies
- Docker 24.0+
- Docker Compose 2.0+
- Python 3.11+
- Node.js 18+
- Ansible 2.15+
- Terraform 1.5+ (for cloud deployments)

## Installation Methods

### Method 1: Docker Compose (Recommended)

This is the fastest way to get started with OTG-TAK.

1. **Install Docker and Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/cywf/otg-tak.git
   cd otg-tak
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your configuration
   ```

4. **Start services**
   ```bash
   docker-compose up -d
   ```

5. **Verify installation**
   ```bash
   docker-compose ps
   curl http://localhost:8000/health
   ```

6. **Access the dashboard**
   - Open browser: http://localhost:3000

### Method 2: Manual Installation

For development or customization purposes.

#### Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r ../requirements.txt
   ```

2. **Initialize database**
   ```bash
   mkdir -p data
   python -c "from app.core.database import init_db; import asyncio; asyncio.run(init_db())"
   ```

3. **Start backend server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

### Method 3: Production Deployment

#### Local (Bare Metal) Deployment

1. **Prepare target server**
   - Ubuntu 22.04 LTS with SSH access
   - Sudo privileges
   - Python 3 installed

2. **Configure Ansible inventory**
   ```bash
   cd ansible
   nano inventory
   ```
   
   Add your server:
   ```ini
   [tak_servers]
   your-server.com ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
   ```

3. **Run deployment playbooks**
   ```bash
   # Test connectivity
   ansible all -m ping
   
   # Install TAK Server
   ansible-playbook playbooks/install-tak-server.yml
   
   # Harden security
   ansible-playbook playbooks/security-hardening.yml
   
   # Setup networking
   ansible-playbook playbooks/setup-networking.yml
   
   # Setup Traefik
   ansible-playbook playbooks/setup-traefik.yml
   
   # Setup MediaMTX (optional)
   ansible-playbook playbooks/setup-mediamtx.yml
   ```

#### Cloud (AWS) Deployment

1. **Configure AWS credentials**
   ```bash
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_DEFAULT_REGION="us-east-1"
   ```

2. **Create Terraform variables**
   ```bash
   cd terraform
   cat > terraform.tfvars <<EOF
   aws_region        = "us-east-1"
   project_name      = "otg-tak"
   environment       = "prod"
   ssh_key_name      = "your-ssh-key-name"
   tak_instance_type = "t3.large"
   EOF
   ```

3. **Deploy infrastructure**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. **Get server IP**
   ```bash
   terraform output tak_server_public_ip
   ```

5. **Configure and deploy application**
   - Update Ansible inventory with new server IP
   - Run Ansible playbooks as shown above

## Post-Installation

### 1. Verify Services

```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000

# Check TAK server (if deployed)
netstat -tulpn | grep 8089
```

### 2. Configure TAK Server

1. Access the dashboard at http://localhost:3000
2. Navigate to Deployment page
3. Create a new deployment with your desired configuration
4. Monitor deployment progress

### 3. Generate Client QR Codes

1. Navigate to QR Generator page
2. Enter TAK server details
3. Generate QR code
4. Distribute to ATAK/iTAK clients

### 4. Set Up Security Monitoring

The security monitoring is automatically configured via Ansible. Check logs:

```bash
# View Lynis audit results
sudo cat /var/log/lynis-audit.log

# Check fail2ban status
sudo fail2ban-client status

# View firewall rules
sudo ufw status verbose
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Verify database
ls -la data/

# Check port availability
sudo netstat -tulpn | grep 8000
```

### Frontend won't start

```bash
# Check logs
docker-compose logs frontend

# Clear cache
cd frontend
rm -rf node_modules
npm install
```

### TAK Server deployment fails

```bash
# Check Ansible logs
ansible-playbook playbooks/install-tak-server.yml -vvv

# Verify SSH connectivity
ansible all -m ping

# Check target server logs
ssh user@server "sudo journalctl -u tak -n 50"
```

### SSL Certificate issues

```bash
# Check Traefik logs
sudo journalctl -u traefik -n 100

# Verify DNS is pointing to your server
dig your-domain.com

# Manually test Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
```

## Updating

### Docker Compose Deployment

```bash
cd otg-tak
git pull
docker-compose down
docker-compose pull
docker-compose up -d
```

### Manual Deployment

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r ../requirements.txt --upgrade
sudo systemctl restart otg-tak-backend

# Frontend
cd frontend
npm install
npm run build
sudo systemctl restart otg-tak-frontend
```

## Backup and Recovery

### Backup

```bash
# Backup database
cp data/otg-tak.db data/otg-tak.db.backup

# Backup configuration
tar -czf otg-tak-config-backup.tar.gz .env ansible/inventory terraform/*.tfvars

# Backup data packages
tar -czf otg-tak-data-backup.tar.gz data/packages data/notes
```

### Recovery

```bash
# Restore database
cp data/otg-tak.db.backup data/otg-tak.db

# Restore configuration
tar -xzf otg-tak-config-backup.tar.gz

# Restore data
tar -xzf otg-tak-data-backup.tar.gz
```

## Next Steps

- Configure your first deployment
- Generate QR codes for clients
- Set up POI tracking
- Create data packages
- Monitor server status

For more information, see:
- [User Guide](USER_GUIDE.md)
- [API Documentation](http://localhost:8000/docs)
- [Security Best Practices](SECURITY.md)
