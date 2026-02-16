# 🚀 AWS EC2 Deployment Guide: Kangpack Ecommerce

This guide provides step-by-step instructions to deploy both the **Backend (Node.js/Express)** and **Frontend (Next.js)** on a single AWS EC2 instance.

---

## 1. AWS EC2 Instance Setup

### Launching the Instance
1.  **Login to AWS Console** and navigate to EC2.
2.  **Launch Instance**:
    -   **Name**: `kangpack-production`
    -   **AMI**: `Ubuntu Server 22.04 LTS` (64-bit x86)
    -   **Instance Type**: `t3.medium` (Recommended: 2 vCPU, 4GB RAM) or at least `t3.small`.
    -   **Key Pair**: Create a new key pair or use an existing one (keep the `.pem` file safe).
3.  **Network Settings (Security Group)**:
    -   Allow **SSH** (Port 22) from My IP.
    -   Allow **HTTP** (Port 80) from Anywhere.
    -   Allow **HTTPS** (Port 443) from Anywhere.
4.  **Storage**: 20GB+ SSD (gp3).
5.  **Launch Instance**.

---

## 2. Server Environment Setup

Once the instance is running, SSH into it:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

### Initial Updates
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (v18+)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Install Essential Tools
```bash
sudo apt install git nginx -y
sudo npm install -g pm2
```

---

## 3. Clone and Configure Projects

Clone your repository into the `/var/www` directory or your home directory:
```bash
cd ~
git clone <your-repository-url> kanpack
cd kanpack
```

### Setup Backend Environment
```bash
cd backend
# Copy the .env.production we created earlier
# or create it manually:
nano .env.production
```
*Note: Ensure `MONGODB_URI` points to your MongoDB Atlas cluster and `CORS_ORIGIN` includes your production domain.*

### Setup Frontend Environment
```bash
cd ../frontend
nano .env.production
```
**Add the following:**
```env
NEXT_PUBLIC_API_URL=https://api.kangpack.in/api/v1
NEXT_PUBLIC_APP_URL=https://kangpack.in
NEXT_PUBLIC_APP_ASSETS=https://api.kangpack.in/
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SDt3Oq2hqQz8jt
```

---

## 4. Build and Run Applications

### Deploy Backend
```bash
cd ../backend
npm install
npm run build
# (Optional) Seed the database if its the first time
# npm run seed:simple
```

### Deploy Frontend
```bash
cd ../frontend
npm install
npm run build
#Important for EC2
cd /var/www/kangpack/frontend
NODE_OPTIONS="--max-old-space-size=1536" npm run build
```

### Start with PM2 (Initial Setup)
Go to the root of the project where `ecosystem.config.js` is located:
```bash
cd /var/www/kangpack
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# (Run the command outputted by the startup step)
```

---

## 5. Automated Deployment (GitHub Actions)

Once the initial setup above is complete, you can use GitHub Actions to automate all future deployments.

### Setup Instructions:
1.  **Add Secrets to GitHub**:
    -   Go to your repo on GitHub > **Settings** > **Secrets and variables** > **Actions**.
    -   Add `EC2_HOST` (Your IP), `EC2_USER` (`ubuntu`), and `EC2_SSH_KEY` (The content of your `.pem` file).
2.  **Push Changes**:
    -   Whenever you push to the `main` branch, GitHub will automatically SSH into your server, pull the latest code, build both apps, and restart PM2.

*Note: The manual build steps in Section 4 are only required for the very first time you set up the server.*

---

## 6. Nginx Reverse Proxy Configuration

We will use Nginx to map `kangpack.in` to the frontend (port 3000) and `api.kangpack.in` to the backend (port 8000).

```bash
sudo nano /etc/nginx/sites-available/kangpack
```

**Paste the following configuration:**
```nginx
# Frontend: kangpack.in
server {
    listen 80;
    server_name kangpack.in www.kangpack.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend: api.kangpack.in
server {
    listen 80;
    server_name api.kangpack.in;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Enable large file uploads for product images
        client_max_body_size 10M;
    }
}
```

### Enable Configuration and Restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/kangpack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. SSL with Certbot (HTTPS)

Important: You must have your domain names (`kangpack.in` and `api.kangpack.in`) pointing to your EC2 Public IP via A-records in your DNS provider (e.g., GoDaddy/Route53).

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d kangpack.in -d www.kangpack.in -d api.kangpack.in
```
*Follow the prompts to enable redirection to HTTPS.*

---

## 8. Final Testing

1.  **Backend Health Check**: Visit `https://api.kangpack.in/api/v1/health` (if you have such an endpoint) or `https://api.kangpack.in/api/v1/products`.
2.  **Frontend Check**: Visit `https://kangpack.in`.
3.  **Integration Check**: Log in to the admin panel and try to upload a product to verify the Backend-Frontend-Cloudinary connection.

---

## 🛠 Troubleshooting
-   **Check Logs**: `pm2 logs`
-   **Nginx Logs**: `sudo tail -f /var/log/nginx/error.log`
-   **Reload Apps**: `pm2 restart all`
