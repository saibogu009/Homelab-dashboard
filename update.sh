#!/usr/bin/env bash

# ==========================================
# Homelab Dashboard Update Script
# ==========================================

set -euo pipefail

INSTALL_DIR="/opt/homelab-dashboard"
SERVICE_NAME="homelab-dashboard"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Updating Homelab Dashboard in ${INSTALL_DIR}...${NC}"

if [ ! -d "${INSTALL_DIR}" ]; then
    echo -e "${CYAN}Directory ${INSTALL_DIR} does not exist. Running full installer...${NC}"
    curl -fsSL https://raw.githubusercontent.com/saibogu009/Homelab-dashboard/main/install.sh | bash
    exit 0
fi

cd "${INSTALL_DIR}"

if [ -d ".git" ]; then
    echo -e "${BLUE}Pulling latest code from git...${NC}"
    git pull --rebase || git pull
else
    echo -e "${BLUE}Fetching latest release...${NC}"
    rm -rf "${INSTALL_DIR:?}"/*
    git clone https://github.com/saibogu009/Homelab-dashboard.git .
fi

echo -e "${BLUE}Installing dependencies & rebuilding...${NC}"
npm install --no-audit --no-fund
npm run build

echo -e "${BLUE}Restarting ${SERVICE_NAME} service...${NC}"
systemctl restart "${SERVICE_NAME}"

echo -e "\n${GREEN}=======================================================${NC}"
echo -e "${GREEN}  ✓ Homelab Dashboard updated successfully!${NC}"
echo -e "${GREEN}=======================================================${NC}\n"
