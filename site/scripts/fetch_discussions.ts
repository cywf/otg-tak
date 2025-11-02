#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'cywf';
const REPO_NAME = 'otg-tak';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

async function fetchDiscussions(): Promise<Discussion[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'otg-tak-site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            title
            author {
              login
            }
            url
            createdAt
            category {
              name
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: {
        owner: REPO_OWNER,
        name: REPO_NAME,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch discussions: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  const discussions = data.data?.repository?.discussions?.nodes || [];

  return discussions.map((d: any) => ({
    title: d.title,
    author: d.author?.login || 'Unknown',
    url: d.url,
    createdAt: d.createdAt,
    category: d.category?.name || 'General',
  }));
}

async function main() {
  try {
    console.log('Fetching GitHub Discussions...');
    
    if (!GITHUB_TOKEN) {
      console.warn('Warning: GITHUB_TOKEN not set. Discussions fetch may fail or be rate-limited.');
    }
    
    const discussions = await fetchDiscussions();
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write discussions to JSON file
    const outputPath = join(outputDir, 'discussions.json');
    writeFileSync(outputPath, JSON.stringify(discussions, null, 2));
    
    console.log(`✓ Discussions written to ${outputPath}`);
    console.log(`  - Total discussions: ${discussions.length}`);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    // Don't fail the build, just create an empty array
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'discussions.json');
    writeFileSync(outputPath, JSON.stringify([], null, 2));
    console.log('Created empty discussions.json');
  }
}

main();
