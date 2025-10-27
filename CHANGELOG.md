# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of OTG-TAK
- FastAPI backend with comprehensive API endpoints
- React frontend dashboard with 10 feature pages
- TAK Server automated provisioning
- Security hardening with Lynis integration
- Networking support (Tailscale & Zerotier)
- Traefik reverse proxy with automatic SSL
- MediaMTX server for ISR feeds
- QR code generator for client onboarding
- Data Package Builder
- Route Package Builder with waypoint support
- SDR (Surveillance Detection Route) Builder
- KML/KMZ file converter
- POI (Person of Interest) Tracker
- Shared Notepad for collaborative notes
- Server Status dashboard with real-time metrics
- Deployment progress tracking
- Docker and Docker Compose support
- Ansible playbooks for automation
- Terraform modules for cloud deployment (AWS)
- Comprehensive documentation (README, INSTALL, CONTRIBUTING)
- Quick-start script for easy setup
- Makefile for common operations

### Features
- **Dual Deployment Options**: Local (bare metal) and Cloud (Terraform)
- **Security**: Automated security scans, firewall configuration, fail2ban
- **Networking**: Multiple VPN options with Tailscale and Zerotier
- **Monitoring**: Real-time server status and metrics visualization
- **Tactical Tools**: Route planning, SDR creation, POI tracking
- **Collaboration**: Shared notepad accessible to all TAK clients
- **File Management**: Data package creation and KML/KMZ conversion

### Technical Stack
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic
- **Frontend**: React 18, Vite, Axios, React Router
- **Database**: SQLite (with async support)
- **Infrastructure**: Docker, Ansible, Terraform
- **Networking**: Traefik, Tailscale, Zerotier
- **Media**: MediaMTX for RTSP/HLS/WebRTC streaming

### Documentation
- Complete API documentation via OpenAPI/Swagger
- Installation guide with multiple deployment methods
- Contributing guidelines
- Environment configuration examples

[1.0.0]: https://github.com/cywf/otg-tak/releases/tag/v1.0.0
