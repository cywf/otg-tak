#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'cywf';
const REPO_NAME = 'otg-tak';
const MAX_ISSUES_PER_PAGE = 100;

interface ProjectItem {
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
}

interface ProjectsData {
  columns: Record<string, ProjectItem[]>;
}

async function fetchProjects(): Promise<ProjectsData> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'otg-tak-site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  // Fallback: Use issues grouped by status labels
  console.log('Fetching issues grouped by status labels...');
  
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=${MAX_ISSUES_PER_PAGE}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.statusText}`);
  }

  const issues = await response.json();

  const columns: Record<string, ProjectItem[]> = {
    'To Do': [],
    'In Progress': [],
    'Done': [],
  };

  for (const issue of issues) {
    // Skip pull requests
    if (issue.pull_request) continue;

    const labels = issue.labels.map((l: any) => l.name);
    const item: ProjectItem = {
      title: issue.title,
      status: 'To Do',
      labels,
      assignees: issue.assignees.map((a: any) => a.login),
      url: issue.html_url,
    };

    // Categorize by status label
    if (labels.some((l: string) => l.includes('status:doing') || l.includes('in progress'))) {
      columns['In Progress'].push(item);
    } else if (labels.some((l: string) => l.includes('status:done') || l.includes('completed'))) {
      columns['Done'].push(item);
    } else {
      columns['To Do'].push(item);
    }
  }

  return { columns };
}

async function main() {
  try {
    console.log('Fetching project data...');
    
    if (!GITHUB_TOKEN) {
      console.warn('Warning: GITHUB_TOKEN not set. Project data fetch may be limited.');
    }
    
    const projects = await fetchProjects();
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write projects to JSON file
    const outputPath = join(outputDir, 'projects.json');
    writeFileSync(outputPath, JSON.stringify(projects, null, 2));
    
    console.log(`✓ Projects written to ${outputPath}`);
    Object.entries(projects.columns).forEach(([column, items]) => {
      console.log(`  - ${column}: ${items.length} items`);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Don't fail the build, create a default structure
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'projects.json');
    writeFileSync(outputPath, JSON.stringify({
      columns: {
        'To Do': [],
        'In Progress': [],
        'Done': [],
      }
    }, null, 2));
    console.log('Created empty projects.json');
  }
}

main();
