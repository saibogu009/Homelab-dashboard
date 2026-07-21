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
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs >/dev/null
fi

echo -e "${GREEN}✓ Node.js $(node -v) installed.${NC}"

DEFAULT_REPO="saibogu009/Homelab-dashboard"
# Accept repository from parameter 1, env var REPO_URL, or GITHUB_REPOSITORY (falling back to DEFAULT_REPO)
REPO="${1:-${REPO_URL:-${GITHUB_REPOSITORY:-${DEFAULT_REPO}}}}"

echo -e "${BLUE}[3/5] Setting up application files in ${INSTALL_DIR}...${NC}"
mkdir -p "${INSTALL_DIR}"

if [ -f "./package.json" ]; then
    echo -e "Copying local repository files to ${INSTALL_DIR}..."
    cp -rn ./* "${INSTALL_DIR}/" 2>/dev/null || cp -r ./* "${INSTALL_DIR}/"
elif [ -n "${REPO}" ]; then
    # Format repo URL if user passed "user/repo" vs full https URL
    if [[ "${REPO}" != http* ]]; then
        REPO="https://github.com/${REPO}.git"
    fi
    echo -e "Cloning ${REPO} into ${INSTALL_DIR}..."
    rm -rf "${INSTALL_DIR:?}"/*
    git clone "${REPO}" "${INSTALL_DIR}"
else
    # Interactive prompt fallback if running in TTY, else error
    if [ -t 0 ]; then
        echo -e "${YELLOW}Please enter your GitHub repository (e.g. username/repository or https://github.com/username/repository.git):${NC}"
        read -r REPO_INPUT
        if [[ "${REPO_INPUT}" != http* ]]; then
            REPO_INPUT="https://github.com/${REPO_INPUT}.git"
        fi
        echo -e "Cloning ${REPO_INPUT} into ${INSTALL_DIR}..."
        git clone "${REPO_INPUT}" "${INSTALL_DIR}"
    else
        echo -e "${RED}Error: package.json not found and no GitHub repository specified.${NC}"
        echo -e "Please pass your repository when running the installer script, for example:"
        echo -e "  ${CYAN}curl -fsSL https://raw.githubusercontent.com/saibogu009/Homelab-dashboard/main/install.sh | bash${NC}"
        echo -e "or pass a specific repo:"
        echo -e "  ${CYAN}curl -fsSL https://raw.githubusercontent.com/saibogu009/Homelab-dashboard/main/install.sh | bash -s -- saibogu009/Homelab-dashboard${NC}"
        exit 1
    fi
fi

cd "${INSTALL_DIR}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json was not found in ${INSTALL_DIR}. Installation aborted.${NC}"
    exit 1
fi

echo -e "${BLUE}[4/5] Installing npm dependencies & building production assets...${NC}"
npm install --no-audit --no-fund
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
