#!/usr/bin/env node
import { writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface Module {
  name: string;
  path: string;
  type: string;
}

interface ModulesData {
  ansible: Module[];
  terraform: Module[];
  backend: Module[];
  frontend: Module[];
}

function scanDirectory(basePath: string, relativePath: string = ''): string[] {
  const items: string[] = [];
  const fullPath = join(basePath, relativePath);

  try {
    const entries = readdirSync(fullPath);
    
    for (const entry of entries) {
      const entryPath = join(fullPath, entry);
      const stat = statSync(entryPath);
      
      if (stat.isDirectory()) {
        items.push(join(relativePath, entry));
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return items;
}

function scanModules(): ModulesData {
  const repoRoot = join(process.cwd(), '..');
  const modules: ModulesData = {
    ansible: [],
    terraform: [],
    backend: [],
    frontend: [],
  };

  // Scan Ansible roles
  const ansiblePath = join(repoRoot, 'ansible');
  const ansibleItems = scanDirectory(ansiblePath);
  modules.ansible = ansibleItems.map(item => ({
    name: item.split('/').pop() || item,
    path: `ansible/${item}`,
    type: 'Ansible Role/Playbook',
  }));

  // Scan Terraform modules
  const terraformPath = join(repoRoot, 'terraform');
  const terraformItems = scanDirectory(terraformPath, 'modules');
  modules.terraform = terraformItems.map(item => ({
    name: item.split('/').pop() || item,
    path: `terraform/${item}`,
    type: 'Terraform Module',
  }));

  // Scan Backend services
  const backendPath = join(repoRoot, 'backend', 'app');
  const backendItems = scanDirectory(backendPath);
  modules.backend = backendItems.map(item => ({
    name: item.split('/').pop() || item,
    path: `backend/app/${item}`,
    type: 'Backend Service',
  }));

  // Scan Frontend pages
  const frontendPath = join(repoRoot, 'frontend', 'src');
  const frontendItems = scanDirectory(frontendPath);
  modules.frontend = frontendItems.map(item => ({
    name: item.split('/').pop() || item,
    path: `frontend/src/${item}`,
    type: 'Frontend Component',
  }));

  return modules;
}

async function main() {
  try {
    console.log('Scanning project modules...');
    
    const modules = scanModules();
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write modules to JSON file
    const outputPath = join(outputDir, 'modules.json');
    writeFileSync(outputPath, JSON.stringify(modules, null, 2));
    
    console.log(`✓ Modules written to ${outputPath}`);
    console.log(`  - Ansible: ${modules.ansible.length} items`);
    console.log(`  - Terraform: ${modules.terraform.length} items`);
    console.log(`  - Backend: ${modules.backend.length} items`);
    console.log(`  - Frontend: ${modules.frontend.length} items`);
  } catch (error) {
    console.error('Error scanning modules:', error);
    // Don't fail the build
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'modules.json');
    writeFileSync(outputPath, JSON.stringify({
      ansible: [],
      terraform: [],
      backend: [],
      frontend: [],
    }, null, 2));
    console.log('Created empty modules.json');
  }
}

main();
