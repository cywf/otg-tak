#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'cywf';
const REPO_NAME = 'otg-tak';

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commitActivity: Array<{ week: string; commits: number }>;
}

async function fetchRepoData(): Promise<RepoStats> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'otg-tak-site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  // Fetch repository info
  const repoResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
    { headers }
  );
  
  if (!repoResponse.ok) {
    throw new Error(`Failed to fetch repo data: ${repoResponse.statusText}`);
  }
  
  const repoData = await repoResponse.json();

  // Fetch languages
  const languagesResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/languages`,
    { headers }
  );
  
  const languages = languagesResponse.ok ? await languagesResponse.json() : {};

  // Fetch commit activity (last 12 weeks)
  const statsResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/participation`,
    { headers }
  );
  
  let commitActivity: Array<{ week: string; commits: number }> = [];
  
  if (statsResponse.ok) {
    const statsData = await statsResponse.json();
    const weeks = statsData.all || [];
    const last12Weeks = weeks.slice(-12);
    
    commitActivity = last12Weeks.map((commits: number, index: number) => {
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - (11 - index) * 7);
      return {
        week: weekDate.toISOString().split('T')[0],
        commits,
      };
    });
  }

  return {
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    watchers: repoData.watchers_count || 0,
    languages,
    commitActivity,
  };
}

async function main() {
  try {
    console.log('Fetching repository statistics...');
    const stats = await fetchRepoData();
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write stats to JSON file
    const outputPath = join(outputDir, 'stats.json');
    writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    
    console.log(`✓ Stats written to ${outputPath}`);
    console.log(`  - Stars: ${stats.stars}`);
    console.log(`  - Forks: ${stats.forks}`);
    console.log(`  - Watchers: ${stats.watchers}`);
    console.log(`  - Languages: ${Object.keys(stats.languages).join(', ')}`);
    console.log(`  - Commit data points: ${stats.commitActivity.length}`);
  } catch (error) {
    console.error('Error fetching repo data:', error);
    process.exit(1);
  }
}

main();
