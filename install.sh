#!/usr/bin/env bash

# ==========================================
# Homelab Dashboard LXC Installer
# Inspired by Proxmox VE Helper-Scripts (community-scripts.org style)
# ==========================================

set -euo pipefail

APP_NAME="Homelab Dashboard"
INSTALL_DIR="/opt/homelab-dashboard"
SERVICE_NAME="homelab-dashboard"
PORT=3000

# Color definitions
RED='\031[0;31m'
GREEN='\032[0;32m'
YELLOW='\033[1;33m'
BLUE='\034[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
cat << "EOF"
  ____  _  ___   _______   ____ ___  ____  _____ 
 / ___|| |/ / \ | |_   _| / ___/ _ \|  _ \| ____|
 \___ \| ' /|  \| | | |  | |  | | | | |_) |  _|  
  ___) | . \| |\  | | |  | |__| |_| |  _ <| |___ 
 |____/|_|\_\_| \_| |_|   \____\___/|_| \_\_____|
               HOMELAB DASHBOARD
EOF
echo -e "${NC}"

echo -e "${BLUE}[1/5] Updating OS packages and installing dependencies...${NC}"
apt-get update -qq
apt-get install -y -qq curl git build-essential ca-certificates gnupg >/dev/null

echo -e "${BLUE}[2/5] Checking and installing Node.js 20.x LTS...${NC}"
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]]; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list >/dev/null
    apt-get update -qq
    apt-get install -y -qq nodejs >/dev/null
fi

echo -e "${GREEN}✓ Node.js $(node -v) installed.${NC}"

echo -e "${BLUE}[3/5] Setting up application files in ${INSTALL_DIR}...${NC}"
mkdir -p "${INSTALL_DIR}"

# If running inside a git cloned directory or if script was run standalone
if [ -f "./package.json" ]; then
    echo -e "Copying local repository files to ${INSTALL_DIR}..."
    cp -r ./* "${INSTALL_DIR}/"
elif [ -n "${GITHUB_REPOSITORY:-}" ]; then
    echo -e "Cloning ${GITHUB_REPOSITORY} into ${INSTALL_DIR}..."
    git clone "https://github.com/${GITHUB_REPOSITORY}.git" "${INSTALL_DIR}"
fi

cd "${INSTALL_DIR}"

echo -e "${BLUE}[4/5] Installing npm packages & building production distribution...${NC}"
npm ci --prefer-offline --no-audit || npm install --no-audit
npm run build

echo -e "${BLUE}[5/5] Creating Systemd service (${SERVICE_NAME}.service)...${NC}"
cat << EOF > /etc/systemd/system/${SERVICE_NAME}.service
[Unit]
Description=Homelab Dashboard Web Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port ${PORT}
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now ${SERVICE_NAME}

# Retrieve IP address
IP_ADDR=$(hostname -I | awk '{print $1}')

echo -e "\n${GREEN}=======================================================${NC}"
echo -e "${GREEN}  SUCCESSFULLY DEPLOYED HOMELAB DASHBOARD LXC!${NC}"
echo -e "${GREEN}=======================================================${NC}"
echo -e " Access your dashboard in your browser at:"
echo -e "   ${CYAN}http://${IP_ADDR}:${PORT}${NC}"
echo -e ""
echo -e " Manage service:"
echo -e "   Status:  ${YELLOW}systemctl status ${SERVICE_NAME}${NC}"
echo -e "   Restart: ${YELLOW}systemctl restart ${SERVICE_NAME}${NC}"
echo -e "   Logs:    ${YELLOW}journalctl -u ${SERVICE_NAME} -f${NC}"
echo -e "${GREEN}=======================================================${NC}\n"
