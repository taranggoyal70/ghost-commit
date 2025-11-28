import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';

/**
 * Quick Analyze API - Actually analyzes a repo and generates real recommendations
 * This is a "lite" version that shows real AI analysis without modifying anything
 */

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

    // Check if we have API keys
    const hasGitHub = !!process.env.GITHUB_TOKEN;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    if (!hasGitHub) {
      return NextResponse.json({
        success: false,
        error: 'GitHub token not configured',
        demo: true,
        message: 'Add GITHUB_TOKEN to .env.local to enable real analysis'
      });
    }

    // Initialize GitHub API
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Step 1: Get real repository data
    const repoData = await octokit.repos.get({
      owner,
      repo: repoName,
    });

    // Step 2: Get package.json if it exists
    let packageJson: any = null;
    try {
      const { data: pkgData } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: 'package.json',
      });

      if ('content' in pkgData) {
        const content = Buffer.from(pkgData.content, 'base64').toString('utf-8');
        packageJson = JSON.parse(content);
      }
    } catch (e) {
      // No package.json found
    }

    // Step 3: Get recent commits
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo: repoName,
      per_page: 5,
    });

    // Step 4: Analyze with AI if available
    let aiAnalysis = null;
    if (hasOpenAI && packageJson) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `Analyze this GitHub repository and provide specific, actionable recommendations:

Repository: ${repoData.data.full_name}
Description: ${repoData.data.description || 'No description'}
Language: ${repoData.data.language}
Stars: ${repoData.data.stargazers_count}
Last Updated: ${repoData.data.updated_at}

Package.json dependencies:
${JSON.stringify(packageJson.dependencies || {}, null, 2)}

DevDependencies:
${JSON.stringify(packageJson.devDependencies || {}, null, 2)}

Provide a brief analysis (3-4 sentences) covering:
1. What this project does
2. Current state (outdated, modern, etc.)
3. Top 3 specific improvements needed
4. Estimated effort to modernize

Be specific and actionable. Format as plain text.`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert software architect analyzing GitHub repositories. Provide concise, actionable insights.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        aiAnalysis = completion.choices[0].message.content;
      } catch (e) {
        console.error('OpenAI error:', e);
        aiAnalysis = 'AI analysis unavailable';
      }
    }

    // Step 5: Detect issues
    const issues = [];
    
    if (packageJson) {
      // Check for outdated React
      const reactVersion = packageJson.dependencies?.react;
      if (reactVersion && (reactVersion.includes('^16') || reactVersion.includes('^17'))) {
        issues.push({
          type: 'outdated-react',
          severity: 'high',
          message: `React ${reactVersion} is outdated. Latest is React 18+`,
          recommendation: 'Upgrade to React 18 for better performance and features',
        });
      }

      // Check for missing TypeScript
      if (!packageJson.devDependencies?.typescript) {
        issues.push({
          type: 'no-typescript',
          severity: 'medium',
          message: 'No TypeScript detected',
          recommendation: 'Add TypeScript for better type safety and developer experience',
        });
      }

      // Check for old Next.js
      const nextVersion = packageJson.dependencies?.next;
      if (nextVersion && !nextVersion.includes('14') && !nextVersion.includes('15')) {
        issues.push({
          type: 'outdated-nextjs',
          severity: 'high',
          message: `Next.js ${nextVersion} is outdated`,
          recommendation: 'Upgrade to Next.js 14+ for App Router and better performance',
        });
      }
    }

    // Calculate "dead" score
    const lastCommitDate = new Date(commits[0]?.commit.author?.date || repoData.data.updated_at);
    const daysSinceLastCommit = Math.floor((Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
    const isStale = daysSinceLastCommit > 180; // 6 months

    return NextResponse.json({
      success: true,
      repository: {
        owner,
        name: repoName,
        fullName: repoData.data.full_name,
        description: repoData.data.description,
        stars: repoData.data.stargazers_count,
        language: repoData.data.language,
        lastCommit: lastCommitDate.toISOString(),
        daysSinceLastCommit,
        isStale,
      },
      analysis: {
        hasPackageJson: !!packageJson,
        framework: packageJson?.dependencies?.next ? 'Next.js' : 
                   packageJson?.dependencies?.react ? 'React' : 
                   'Unknown',
        dependencies: packageJson ? Object.keys(packageJson.dependencies || {}).length : 0,
        devDependencies: packageJson ? Object.keys(packageJson.devDependencies || {}).length : 0,
        issues,
        aiInsights: aiAnalysis,
      },
      recommendations: {
        priority: issues.length > 2 ? 'high' : issues.length > 0 ? 'medium' : 'low',
        estimatedTime: issues.length > 2 ? '4-6 hours' : issues.length > 0 ? '2-3 hours' : '1 hour',
        topActions: issues.slice(0, 3).map(i => i.recommendation),
      },
    });

  } catch (error: any) {
    console.error('Quick analyze error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to analyze repository',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
