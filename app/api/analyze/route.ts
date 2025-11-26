import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Fetch repository information
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo: repoName,
    });

    // Fetch package.json to detect dependencies
    let packageJson = null;
    let detectedFramework = 'unknown';
    let detectedScenario = 'default';
    
    try {
      const { data: packageData } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: 'package.json',
      });

      if ('content' in packageData) {
        const content = Buffer.from(packageData.content, 'base64').toString();
        packageJson = JSON.parse(content);

        // Detect framework and scenario
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (deps.react) {
          const reactVersion = deps.react.replace(/[\^~]/, '');
          if (reactVersion.startsWith('16') || reactVersion.startsWith('17')) {
            detectedScenario = 'outdated-react';
            detectedFramework = `React ${reactVersion}`;
          }
        }

        if (deps.next) {
          const nextVersion = deps.next.replace(/[\^~]/, '');
          if (parseInt(nextVersion) < 13) {
            detectedScenario = 'nextjs-migration';
            detectedFramework = `Next.js ${nextVersion}`;
          }
        }

        if (!deps.typescript && !deps['@types/react']) {
          if (detectedScenario === 'default') {
            detectedScenario = 'add-typescript';
          }
        }

        // Check for authentication
        const hasAuth = deps['@stackframe/stack'] || 
                       deps['next-auth'] || 
                       deps['auth0'] ||
                       deps['firebase'];
        
        if (!hasAuth && detectedScenario === 'default') {
          detectedScenario = 'no-auth';
        }
      }
    } catch (error) {
      console.log('No package.json found or error reading it');
    }

    // Analyze repository structure
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: '',
    });

    const fileStructure = Array.isArray(contents)
      ? contents.map((item) => ({
          name: item.name,
          type: item.type,
          path: item.path,
        }))
      : [];

    // Count files by type
    const hasTests = fileStructure.some(f => 
      f.name.includes('test') || 
      f.name.includes('spec') ||
      f.name === '__tests__'
    );

    const hasDocker = fileStructure.some(f => 
      f.name === 'Dockerfile' || 
      f.name === 'docker-compose.yml'
    );

    const hasCI = fileStructure.some(f => 
      f.name === '.github' || 
      f.name === '.gitlab-ci.yml'
    );

    // Determine issues
    const issues = [];
    
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for outdated dependencies
      const outdatedDeps = [];
      if (deps.react?.includes('16') || deps.react?.includes('17')) {
        outdatedDeps.push('React (outdated)');
      }
      if (deps.next && parseInt(deps.next.replace(/[\^~]/, '')) < 14) {
        outdatedDeps.push('Next.js (outdated)');
      }
      if (deps.webpack && parseInt(deps.webpack.replace(/[\^~]/, '')) < 5) {
        outdatedDeps.push('Webpack (outdated)');
      }

      if (outdatedDeps.length > 0) {
        issues.push({
          type: 'outdated-dependencies',
          severity: 'high',
          items: outdatedDeps,
        });
      }

      // Check for missing features
      if (!deps['@stackframe/stack'] && !deps['next-auth']) {
        issues.push({
          type: 'no-authentication',
          severity: 'medium',
          message: 'No authentication system detected',
        });
      }

      if (!deps.typescript) {
        issues.push({
          type: 'no-typescript',
          severity: 'low',
          message: 'JavaScript-only project',
        });
      }
    }

    if (!hasTests) {
      issues.push({
        type: 'no-tests',
        severity: 'medium',
        message: 'No test suite detected',
      });
    }

    if (!hasDocker) {
      issues.push({
        type: 'no-docker',
        severity: 'low',
        message: 'No Docker configuration',
      });
    }

    if (!hasCI) {
      issues.push({
        type: 'no-ci',
        severity: 'low',
        message: 'No CI/CD pipeline',
      });
    }

    // Calculate last commit date
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo: repoName,
      per_page: 1,
    });

    const lastCommitDate = commits[0]?.commit.author?.date;
    const daysSinceLastCommit = lastCommitDate
      ? Math.floor((Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const isDead = daysSinceLastCommit && daysSinceLastCommit > 180; // 6 months

    return NextResponse.json({
      success: true,
      repository: {
        owner,
        name: repoName,
        fullName: `${owner}/${repoName}`,
        description: repoData.description,
        stars: repoData.stargazers_count,
        language: repoData.language,
        lastCommit: lastCommitDate,
        daysSinceLastCommit,
        isDead,
      },
      analysis: {
        framework: detectedFramework,
        scenario: detectedScenario,
        packageJson: packageJson ? {
          name: packageJson.name,
          version: packageJson.version,
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {}),
        } : null,
        fileStructure: fileStructure.slice(0, 20), // First 20 items
        hasTests,
        hasDocker,
        hasCI,
        issues,
        issueCount: issues.length,
      },
      recommendations: {
        scenario: detectedScenario,
        priority: isDead ? 'high' : 'medium',
        estimatedTime: '3-5 minutes',
      },
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze repository',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
