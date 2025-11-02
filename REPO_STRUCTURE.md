# Repository Structure

This file is auto-generated and shows the structure of the OTG-TAK repository.

## Directory Tree

```
.
├── CHANGELOG.md
├── CONTRIBUTING.md
├── INSTALL.md
├── LICENSE
├── Makefile
├── PROJECT_SUMMARY.md
├── README.md
├── REPO_STRUCTURE.md
├── ansible
│   ├── ansible.cfg
│   ├── inventory
│   └── playbooks
├── backend
│   ├── Dockerfile
│   ├── app
│   └── main.py
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── src
│   └── vite.config.js
├── mermaid
│   ├── architecture.mmd
│   ├── bpmnish.mmd
│   ├── ci-sequence.mmd
│   ├── er.mmd
│   └── flowchart.mmd
├── package.json
├── quick-start.sh
├── requirements.txt
├── scripts
│   ├── generate-markmap.mjs
│   ├── generate-mermaid.mjs
│   └── health-check.sh
├── site
│   ├── README.md
│   ├── astro.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── scripts
│   ├── src
│   ├── tailwind.config.mjs
│   └── tsconfig.json
└── terraform
    ├── main.tf
    ├── modules
    └── variables.tf

15 directories, 35 files
```

## Mermaid Diagram

```mermaid
graph TD
  A[otg-tak] --> B[backend]
  A --> C[frontend]
  A --> D[ansible]
  A --> E[terraform]
  A --> F[scripts]
  
  B --> B1[app]
  B --> B2[Dockerfile]
  B --> B3[main.py]
  
  B1 --> B1A[api]
  B1 --> B1B[core]
  B1 --> B1C[models]
  B1 --> B1D[services]
  B1 --> B1E[utils]
  
  C --> C1[src]
  C --> C2[Dockerfile]
  C --> C3[vite.config.js]
  
  C1 --> C1A[components]
  C1 --> C1B[pages]
  C1 --> C1C[services]
  
  D --> D1[playbooks]
  D1 --> D1A[install-tak-server.yml]
  D1 --> D1B[security-hardening.yml]
  D1 --> D1C[setup-networking.yml]
  
  E --> E1[modules]
  E1 --> E1A[tak-server]
  E1 --> E1B[networking]
  E1 --> E1C[security]
```

---
*Last updated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')*
