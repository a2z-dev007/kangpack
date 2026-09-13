# 🛠️ Hostinger KVM 1 VPS Manual Deployment Guide: Kangpack

Complete step-by-step manual runbook for deploying **Kangpack** (Next.js 15 Standalone Frontend + Express TypeScript Backend + Local Authenticated MongoDB) on your **Hostinger KVM 1 VPS**.

---

## 🖥️ Your Server Details (From Hostinger Panel)

| Property | Value |
| :--- | :--- |
| **Server Hostname** | `srv1977083.hstgr.cloud` |
| **Public IPv4** | `82.112.227.42` |
| **SSH User** | `root` |
| **SSH Login Command** | `ssh root@82.112.227.42` |
| **Plan / Resources** | Hostinger KVM 1 (1 vCPU, 4 GB RAM, 50 GB NVMe Storage) |
| **Operating System** | Ubuntu LTS |

---

## 📋 Table of Contents
1. [DNS Records Setup](#1-dns-records-setup)
2. [SSH Login & System Updates](#2-ssh-login--system-updates)
3. [Configure 4GB Swap Memory (KVM 1 Essential)](#3-configure-4gb-swap-memory-kvm-1-essential)
4. [Install Essential Build Tools & Security](#4-install-essential-build-tools--security)
5. [Install Node.js 20 LTS & PM2](#5-install-nodejs-20-lts--pm2)
6. [Install & Configure Local MongoDB](#6-install--configure-local-mongodb)
7. [Create MongoDB Users & Enable Authentication](#7-create-mongodb-users--enable-authentication)
8. [Configure UFW Firewall](#8-configure-ufw-firewall)
9. [Clone Repository & Prepare Directories](#9-clone-repository--prepare-directories)
10. [Configure Environment Variables (.env.production)](#10-configure-environment-variables-envproduction)
11. [Build Applications & Start with PM2](#11-build-applications--start-with-pm2)
12. [Install & Configure Nginx Reverse Proxy](#12-install--configure-nginx-reverse-proxy)
13. [Obtain Free SSL Certificates (Let's Encrypt / Certbot)](#13-obtain-free-ssl-certificates-lets-encrypt--certbot)
14. [Setup Automated Daily Database Backups](#14-setup-automated-daily-database-backups)
15. [Manual Code Update & Redeployment Workflow](#15-manual-code-update--redeployment-workflow)
16. [Useful Management & Debugging Commands](#16-useful-management--debugging-commands)

---

## 1. DNS Records Setup

Before requesting SSL certificates, ensure your DNS **A Records** in your domain manager (Hostinger DNS, Cloudflare, GoDaddy, etc.) point to your VPS IP:

| Record Type | Name / Host | Target IP | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or `kangpack.in`) | `82.112.227.42` | 300 / Auto |
| **A** | `www` | `82.112.227.42` | 300 / Auto |
| **A** | `api` | `82.112.227.42` | 300 / Auto |

> ⏳ *Allow a few minutes for DNS to propagate. You can verify from your local terminal with: `ping kangpack.in`.*

---

## 2. SSH Login & System Updates

Open your terminal on your computer and connect to the VPS:

```bash
ssh root@82.112.227.42
```
*(Enter your root password when prompted)*

Update Ubuntu package lists and upgrade existing software:
```bash
apt update -y && apt upgrade -y
```

---

## 3. Configure 4GB Swap Memory (KVM 1 Essential)

> ⚠️ **Why this is critical on KVM 1:** Next.js build compilation (`next build`) and MongoDB need temporary headroom. A 4GB swap space prevents the Linux Out-Of-Memory (OOM) killer from terminating your build or database.

1. Check if swap is already configured:
   ```bash
   swapon --show
   ```

2. If nothing is printed, allocate and activate 4GB swap:
   ```bash
   fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   ```

3. Ensure swap persists across server reboots:
   ```bash
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```

4. Optimize swappiness for low-latency web hosting:
   ```bash
   sysctl vm.swappiness=10
   echo 'vm.swappiness=10' >> /etc/sysctl.conf
   ```

5. Confirm swap is active:
   ```bash
   free -h
   ```

---

## 4. Install Essential Build Tools & Security

Install Git, build utilities, curl, htop, and Fail2ban (to defend against SSH brute force):

```bash
apt install -y curl wget git build-essential software-properties-common ca-certificates gnupg lsb-release ufw fail2ban htop unzip
```

Enable Fail2ban:
```bash
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 5. Install Node.js 20 LTS & PM2

1. Add NodeSource repository for Node.js 20 LTS:
   ```bash
   mkdir -p /etc/apt/keyrings
   curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
   echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
   ```

2. Install Node.js:
   ```bash
   apt update -y
   apt install -y nodejs
   ```

3. Check versions:
   ```bash
   node -v    # v20.x.x
   npm -v     # v10.x.x
   ```

4. Install **PM2** and automated log rotation:
   ```bash
   npm install -g pm2
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   pm2 set pm2-logrotate:compress true
   ```

---

## 6. Install & Configure Local MongoDB

1. Import official MongoDB 7.0 GPG key:
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes
   ```

2. Add MongoDB repository:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. Install MongoDB:
   ```bash
   apt update -y
   apt install -y mongodb-org
   ```

4. Configure MongoDB for KVM 1 (Strict Localhost binding & 512MB RAM cache limit):
   Open `/etc/mongod.conf`:
   ```bash
   nano /etc/mongod.conf
   ```

   Replace or edit the file with this clean configuration:
   ```yaml
   storage:
     dbPath: /var/lib/mongodb

   systemLog:
     destination: file
     logAppend: true
     path: /var/log/mongodb/mongod.log

   net:
     port: 27017
     bindIp: 127.0.0.1

   processManagement:
     timeZoneInfo: /usr/share/zoneinfo
   ```

5. Enable and start MongoDB:
   ```bash
   systemctl daemon-reload
   systemctl enable mongod
   systemctl start mongod
   ```

6. Verify MongoDB is running locally:
   ```bash
   systemctl status mongod
   # Confirm port 27017 is bound ONLY to 127.0.0.1:
   ss -tulpn | grep 27017
   ```

---

## 7. Create MongoDB Users & Enable Authentication

### Step 1: Open the MongoDB Shell
```bash
mongosh
```

### Step 2: Create the Admin Superuser
In `mongosh`, execute:
```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "K@ngpack.in",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "clusterAdmin", db: "admin" }
  ]
})
```

### Step 3: Create the Application User
In `mongosh`, execute:
```javascript
use kangpack_production

db.createUser({
  user: "kangpack_user",
  pwd: "K@ngpack.in",
  roles: [
    { role: "readWrite", db: "kangpack_production" },
    { role: "dbAdmin", db: "kangpack_production" }
  ]
})
```

Exit the shell:
```javascript
exit
```

### Step 4: Turn on Authentication in MongoDB Config
Edit `/etc/mongod.conf`:
```bash
nano /etc/mongod.conf
```
Add these lines at the bottom of the file:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
systemctl restart mongod
```

### Step 5: Test Authenticated Login
```bash
mongosh -u kangpack_user -p "K@ngpack.in" --authenticationDatabase kangpack_production kangpack_production --eval "db.stats()"
```
If you see JSON stats output, database authentication is configured and secure!

---

## 8. Configure UFW Firewall

Lock down the server so only web traffic and SSH are accessible:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Explicitly ensure internal ports are blocked from the internet
ufw deny 27017/tcp comment 'Block MongoDB Public'
ufw deny 3000/tcp comment 'Block Next.js Public'
ufw deny 8000/tcp comment 'Block Backend Public'

# Enable firewall
ufw --force enable

# Check status
ufw status verbose
```

---

## 9. Clone Repository & Prepare Directories

1. Create application root directory:
   ```bash
   mkdir -p /var/www
   cd /var/www
   ```

2. Clone your repository:
   ```bash
   git clone https://github.com/your-username/kangpack.git kangpack
   cd /var/www/kangpack
   ```

3. Create directories for uploads, logs, and database backups:
   ```bash
   mkdir -p /var/www/kangpack/backend/uploads
   mkdir -p /var/www/kangpack/logs
   mkdir -p /var/backups/mongodb
   ```

4. Set permissions:
   ```bash
   chmod -R 755 /var/www/kangpack
   chmod -R 775 /var/www/kangpack/backend/uploads
   chmod 700 /var/backups/mongodb
   ```

---

## 10. Configure Environment Variables (.env.production)

### 1. Backend Environment Configuration
Create `/var/www/kangpack/backend/.env.production`:
```bash
nano /var/www/kangpack/backend/.env.production
```

Paste and adjust with your passwords:
```ini
NODE_ENV=production
PORT=8000

# Local Authenticated MongoDB Connection (Note: @ in password must be URL-encoded as %40)
MONGODB_URI=mongodb://kangpack_user:K%40ngpack.in@127.0.0.1:27017/kangpack_production?authSource=kangpack_production

# JWT Secrets (Generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=replace_with_32_character_random_string_here
JWT_REFRESH_SECRET=replace_with_another_32_character_random_string_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Secret (at least 16 chars): openssl rand -base64 16
COOKIE_SECRET=replace_with_16_character_random_secret_here
BCRYPT_SALT_ROUNDS=12

# URLs & CORS
FRONTEND_URL=https://kangpack.in
CORS_ORIGIN=https://kangpack.in,https://www.kangpack.in

# File Uploads & Rate Limiting
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300

# Email (Hostinger Titan / Business Email)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=support@kangpack.in
SMTP_PASS=YourEmailPasswordHere
FROM_EMAIL=support@kangpack.in
FROM_NAME="Kangpack Support"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
```

> 💡 *Generate secure secrets on the VPS terminal using:*
> ```bash
> openssl rand -base64 32
> ```

### 2. Frontend Environment Configuration
Create `/var/www/kangpack/frontend/.env.production`:
```bash
nano /var/www/kangpack/frontend/.env.production
```

Paste:
```ini
NEXT_PUBLIC_API_URL=https://api.kangpack.in/api/v1
NEXT_PUBLIC_APP_URL=https://kangpack.in
NEXT_PUBLIC_APP_ASSETS=https://api.kangpack.in/
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

---

## 11. Build Applications & Start with PM2

### Step 1: Build the Backend
```bash
cd /var/www/kangpack/backend
npm install
npm run build
```
Verify `dist/server.js` exists:
```bash
ls -l dist/server.js
```

*(Optional: Seed initial admin user and settings on first install)*:
```bash
node simple-seed.js
```

### Step 2: Build the Frontend (Next.js 15 Standalone)
```bash
cd /var/www/kangpack/frontend
npm install
NODE_OPTIONS="--max-old-space-size=1536" npm run build
```

### Step 3: Copy Static Assets to Next.js Standalone Directory
> **Important:** Next.js standalone mode requires `public/` and `.next/static/` copied into the `.next/standalone/` folder:

```bash
cd /var/www/kangpack/frontend
mkdir -p .next/standalone/.next
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# If standalone created a nested subfolder (e.g. .next/standalone/frontend/):
if [ -d ".next/standalone/frontend" ]; then
  mkdir -p .next/standalone/frontend/.next
  cp -r public .next/standalone/frontend/
  cp -r .next/static .next/standalone/frontend/.next/
fi
```

### Step 4: Start Applications with PM2
Return to the project root:
```bash
cd /var/www/kangpack
pm2 start ecosystem.config.js
```

Check PM2 status:
```bash
pm2 status
```
Both `kangpack-backend` (port 8000) and `kangpack-frontend` (port 3000) should display `online`.

### Step 5: Configure PM2 Autostart on Server Reboot
```bash
pm2 startup systemd
```
*(Copy and run the exact command output by PM2, e.g.: `sudo env PATH=$PATH:/usr/bin ...`)*

Save the process list:
```bash
pm2 save
```

### Step 6: Test Local Endpoints
```bash
# Backend health check:
curl -I http://127.0.0.1:8000/api/v1/health

# Frontend response:
curl -I http://127.0.0.1:3000
```

---

## 12. Install & Configure Nginx Reverse Proxy

1. Install Nginx:
   ```bash
   apt install -y nginx
   ```

2. Delete default welcome page:
   ```bash
   rm -f /etc/nginx/sites-enabled/default
   ```

3. Create the Kangpack Nginx configuration:
   ```bash
   nano /etc/nginx/sites-available/kangpack.conf
   ```

   Paste the configuration:
   ```nginx
   # Rate Limiting
   limit_req_zone $binary_remote_addr zone=api_general_limit:10m rate=30r/s;
   limit_req_zone $binary_remote_addr zone=api_auth_limit:10m rate=5r/s;

   # 1. FRONTEND: kangpack.in & www.kangpack.in
   server {
       listen 80;
       listen [::]:80;
       server_name kangpack.in www.kangpack.in;

       # Security Headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;

       # Gzip Compression
       gzip on;
       gzip_vary on;
       gzip_proxied any;
       gzip_comp_level 6;
       gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml;

       # Direct Static Caching for Next.js
       location /_next/static/ {
           alias /var/www/kangpack/frontend/.next/static/;
           expires 365d;
           access_log off;
           add_header Cache-Control "public, max-age=31536000, immutable";
       }

       location /favicon.ico {
           alias /var/www/kangpack/frontend/public/favicon.ico;
           expires 30d;
           access_log off;
       }

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_connect_timeout 60s;
           proxy_read_timeout 60s;
       }
   }

   # 2. BACKEND API: api.kangpack.in
   server {
       listen 80;
       listen [::]:80;
       server_name api.kangpack.in;

       client_max_body_size 25M;

       # Security Headers
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;

       gzip on;
       gzip_types application/json;

       # Direct Uploads Serving
       location /uploads/ {
           alias /var/www/kangpack/backend/uploads/;
           expires 30d;
           access_log off;
           add_header Cache-Control "public, max-age=2592000";
           add_header Access-Control-Allow-Origin "*";
       }

       # Rate-Limited Auth Route
       location /api/v1/auth/ {
           limit_req zone=api_auth_limit burst=10 nodelay;
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # General API
       location / {
           limit_req zone=api_general_limit burst=50 nodelay;
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_connect_timeout 60s;
           proxy_read_timeout 60s;
       }
   }
   ```

4. Enable the site:
   ```bash
   ln -sf /etc/nginx/sites-available/kangpack.conf /etc/nginx/sites-enabled/kangpack.conf
   ```

5. Test syntax and reload:
   ```bash
   nginx -t
   systemctl reload nginx
   ```

---

## 13. Obtain Free SSL Certificates (Let's Encrypt / Certbot)

1. Install Certbot:
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. Issue certificates and enable HTTPS redirection:
   ```bash
   certbot --nginx -d kangpack.in -d www.kangpack.in -d api.kangpack.in
   ```
   - Enter your email address for certificate notifications.
   - Accept the Terms of Service.
   - Certbot will verify your domains and automatically configure Nginx with SSL and HTTP-to-HTTPS redirect.

3. Verify auto-renewal timer:
   ```bash
   certbot renew --dry-run
   ```

---

## 14. Setup Automated Daily Database Backups

Create a standalone backup script in `/root/backup-mongo.sh`:
```bash
nano /root/backup-mongo.sh
```

Paste:
```bash
#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/kangpack_backup_${TIMESTAMP}.archive.gz"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# Perform backup with authentication
mongodump --uri="mongodb://kangpack_user:YourAppPasswordHere_2026!@127.0.0.1:27017/kangpack_production?authSource=kangpack_production" \
  --archive="$BACKUP_FILE" \
  --gzip

# Keep only the last 7 days of backups
find "$BACKUP_DIR" -name "kangpack_backup_*.archive.gz" -type f -mtime +7 -exec rm -f {} \;

echo "[$(date)] Backup created successfully: $BACKUP_FILE"
```
*(Make sure to replace `YourAppPasswordHere_2026!` with your actual password).*

Make it executable:
```bash
chmod +x /root/backup-mongo.sh
```

Test it immediately:
```bash
bash /root/backup-mongo.sh
ls -lh /var/backups/mongodb
```

Add to cron to run every night at 02:00 AM:
```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-mongo.sh >> /var/log/mongodb-backup.log 2>&1") | crontab -
```

---

## 15. Manual Code Update & Redeployment Workflow

Whenever you push new changes to GitHub and want to update your live server:

```bash
cd /var/www/kangpack

# 1. Pull latest changes
git fetch origin main
git reset --hard origin/main

# 2. Build backend
cd backend
npm install
npm run build
cd ..

# 3. Build frontend
cd frontend
npm install
NODE_OPTIONS="--max-old-space-size=1536" npm run build

# 4. Sync standalone assets
mkdir -p .next/standalone/.next
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
if [ -d ".next/standalone/frontend" ]; then
  mkdir -p .next/standalone/frontend/.next
  cp -r public .next/standalone/frontend/ 2>/dev/null || true
  cp -r .next/static .next/standalone/frontend/.next/ 2>/dev/null || true
fi
cd ..

# 5. Reload processes with zero downtime
pm2 reload ecosystem.config.js --update-env
pm2 save

# 6. Verify health
curl -I http://127.0.0.1:8000/api/v1/health
curl -I http://127.0.0.1:3000
```

---

## 16. Useful Management & Debugging Commands

| Task | Command |
| :--- | :--- |
| **Check PM2 Status** | `pm2 status` |
| **Live Logs (Both Apps)** | `pm2 logs` |
| **Backend Logs (Last 50 lines)**| `pm2 logs kangpack-backend --lines 50` |
| **Frontend Logs (Last 50 lines)**| `pm2 logs kangpack-frontend --lines 50` |
| **Restart Backend** | `pm2 restart kangpack-backend` |
| **Restart Frontend** | `pm2 restart kangpack-frontend` |
| **MongoDB Status** | `systemctl status mongod` |
| **Live MongoDB Logs** | `tail -f /var/log/mongodb/mongod.log` |
| **Nginx Status** | `systemctl status nginx` |
| **Check Nginx Error Logs** | `tail -f /var/log/nginx/error.log` |
| **Test Nginx Config** | `nginx -t` |
| **Check RAM & Swap** | `free -h` and `htop` |
| **Check Disk Storage** | `df -h` |
| **Restore Database Backup** | `mongorestore --uri="mongodb://kangpack_user:YourAppPasswordHere_2026!@127.0.0.1:27017/kangpack_production?authSource=kangpack_production" --archive=/var/backups/mongodb/kangpack_backup_xxx.archive.gz --gzip --drop` |
