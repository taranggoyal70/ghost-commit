import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

// Only initialize OpenAI if key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface DetectedIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

interface PlanStep {
  title: string;
  description: string;
}

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
        { error: 'Invalid GitHub URL. Expected format: https://github.com/owner/repo' },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // GITHUB_TOKEN is optional: with it we get higher rate limits and can read
    // private repos; without it we fall back to unauthenticated access, which
    // still works for public repositories (at GitHub's lower rate limit).
    const octokit = new Octokit(
      process.env.GITHUB_TOKEN ? { auth: process.env.GITHUB_TOKEN } : {}
    );

    // --- Fetch REAL repository data ---
    let repoData;
    try {
      const response = await octokit.repos.get({ owner, repo: repoName });
      repoData = response.data;
    } catch (error: any) {
      const status = error.status === 404 ? 400 : 500;
      return NextResponse.json(
        {
          error:
            error.status === 404
              ? `Repository ${owner}/${repoName} not found (or not accessible with this token)`
              : 'Failed to fetch repository from GitHub',
          details: error.message,
        },
        { status }
      );
    }

    // Fetch package.json (may not exist — that's fine, we report what we find)
    let packageJson: any = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: 'package.json',
      });
      if ('content' in data) {
        packageJson = JSON.parse(Buffer.from(data.content, 'base64').toString());
      }
    } catch {
      // No package.json — not an error, just less data
    }

    // Last commit
    let lastCommit: string | null = null;
    let daysSinceLastCommit: number | null = null;
    try {
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo: repoName,
        per_page: 1,
      });
      lastCommit = commits[0]?.commit.author?.date ?? null;
      if (lastCommit) {
        daysSinceLastCommit = Math.floor(
          (Date.now() - new Date(lastCommit).getTime()) / (1000 * 60 * 60 * 24)
        );
      }
    } catch {
      // Empty repo or no commit access — report null
    }

    // --- Derive REAL analysis from fetched data ---
    const deps: Record<string, string> = {
      ...(packageJson?.dependencies || {}),
      ...(packageJson?.devDependencies || {}),
    };
    const dependencyCount = Object.keys(packageJson?.dependencies || {}).length;
    const devDependencyCount = Object.keys(packageJson?.devDependencies || {}).length;

    let framework = 'unknown';
    if (deps.next) framework = `Next.js ${deps.next.replace(/[\^~]/, '')}`;
    else if (deps.react) framework = `React ${deps.react.replace(/[\^~]/, '')}`;
    else if (deps.vue) framework = `Vue ${deps.vue.replace(/[\^~]/, '')}`;
    else if (deps.express) framework = `Express ${deps.express.replace(/[\^~]/, '')}`;
    else if (repoData.language) framework = repoData.language;

    const issues: DetectedIssue[] = [];

    if (daysSinceLastCommit !== null && daysSinceLastCommit > 180) {
      issues.push({
        type: 'stale',
        severity: 'high',
        message: `No commits in ${daysSinceLastCommit} days — project appears abandoned`,
      });
    }
    if (deps.react && /^[\^~]?(16|17)\./.test(deps.react)) {
      issues.push({
        type: 'outdated-react',
        severity: 'high',
        message: `React ${deps.react} is outdated (current major is 19)`,
      });
    }
    if (deps.next && parseInt(deps.next.replace(/[\^~]/, '')) < 13) {
      issues.push({
        type: 'outdated-nextjs',
        severity: 'high',
        message: `Next.js ${deps.next} predates the App Router (v13+)`,
      });
    }
    if (packageJson && !deps.typescript) {
      issues.push({
        type: 'no-typescript',
        severity: 'low',
        message: 'No TypeScript detected in dependencies',
      });
    }
    if (packageJson && !packageJson.scripts?.test) {
      issues.push({
        type: 'no-test-script',
        severity: 'medium',
        message: 'No "test" script in package.json',
      });
    }
    if (!packageJson) {
      issues.push({
        type: 'no-package-json',
        severity: 'low',
        message: 'No package.json found at repo root — not a Node.js project or non-standard layout',
      });
    }
    if (repoData.open_issues_count > 20) {
      issues.push({
        type: 'issue-backlog',
        severity: 'medium',
        message: `${repoData.open_issues_count} open issues on GitHub`,
      });
    }

    const analysis = {
      language: repoData.language || 'unknown',
      framework,
      lastCommit,
      daysSinceLastCommit,
      dependencyCount,
      devDependencyCount,
      stars: repoData.stargazers_count,
      openIssues: repoData.open_issues_count,
      issues,
    };

    // --- Generate the resurrection plan ---
    let planSteps: PlanStep[] | null = null;
    let aiPowered = false;

    if (openai) {
      try {
        const prompt = `You are an expert code modernization engineer. Based on this REAL repository analysis, create an ordered resurrection plan.

Repository: ${owner}/${repoName}
Description: ${repoData.description || 'none'}
Primary language: ${repoData.language || 'unknown'}
Framework: ${framework}
Last commit: ${lastCommit || 'unknown'} (${daysSinceLastCommit ?? 'unknown'} days ago)
Dependencies (${dependencyCount}): ${JSON.stringify(packageJson?.dependencies || {}, null, 2)}
Detected issues:
${issues.map((i) => `- [${i.severity}] ${i.message}`).join('\n') || '- none detected'}

Return a JSON object: { "steps": [{ "title": string, "description": string }] } with 4-7 ordered steps. Every step must be grounded in the data above — do not invent versions or files you cannot see.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert at modernizing dormant code repositories. Respond only with valid JSON.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        });

        const parsed = JSON.parse(completion.choices[0].message.content || '{}');
        if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          planSteps = parsed.steps
            .filter((s: any) => s && typeof s.title === 'string')
            .map((s: any) => ({
              title: s.title,
              description: typeof s.description === 'string' ? s.description : '',
            }));
          aiPowered = true;
        }
      } catch (error) {
        console.error('OpenAI plan generation failed, using heuristic plan:', error);
      }
    }

    if (!planSteps || planSteps.length === 0) {
      planSteps = buildHeuristicPlan(analysis, packageJson);
      aiPowered = false;
    }

    return NextResponse.json({
      repo: {
        owner,
        name: repoName,
        fullName: `${owner}/${repoName}`,
        description: repoData.description,
        url: repoData.html_url,
      },
      analysis,
      plan: {
        source: aiPowered
          ? 'AI-generated (OpenAI)'
          : 'heuristic plan (set OPENAI_API_KEY for AI analysis)',
        steps: planSteps,
      },
      aiPowered,
    });
  } catch (error: any) {
    console.error('Resurrect analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze repository',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Heuristic fallback plan derived only from data we actually fetched.
 * Clearly labeled as non-AI in the response ("plan.source").
 */
function buildHeuristicPlan(
  analysis: {
    issues: DetectedIssue[];
    framework: string;
    dependencyCount: number;
    daysSinceLastCommit: number | null;
  },
  packageJson: any
): PlanStep[] {
  const steps: PlanStep[] = [];

  steps.push({
    title: 'Audit the current state',
    description: `Clone the repo and run a fresh install/build. Framework detected: ${analysis.framework}. ${analysis.dependencyCount} runtime dependencies declared${
      analysis.daysSinceLastCommit !== null
        ? `; last commit was ${analysis.daysSinceLastCommit} days ago`
        : ''
    }.`,
  });

  for (const issue of analysis.issues) {
    switch (issue.type) {
      case 'outdated-react':
        steps.push({
          title: 'Upgrade React',
          description: `${issue.message}. Upgrade incrementally (16/17 -> 18 -> 19), fixing deprecations at each step.`,
        });
        break;
      case 'outdated-nextjs':
        steps.push({
          title: 'Upgrade Next.js',
          description: `${issue.message}. Upgrade to a current version and evaluate migrating to the App Router.`,
        });
        break;
      case 'no-typescript':
        steps.push({
          title: 'Consider adopting TypeScript',
          description: 'No TypeScript found in dependencies. Adding it incrementally improves maintainability.',
        });
        break;
      case 'no-test-script':
        steps.push({
          title: 'Add a test setup',
          description: 'package.json has no "test" script. Add a test runner and cover critical paths before refactoring.',
        });
        break;
      case 'issue-backlog':
        steps.push({
          title: 'Triage the issue backlog',
          description: `${issue.message}. Close stale issues and identify quick wins.`,
        });
        break;
    }
  }

  if (packageJson) {
    steps.push({
      title: 'Update remaining dependencies',
      description: `Review the ${analysis.dependencyCount} declared dependencies for outdated or vulnerable packages (npm outdated / npm audit).`,
    });
  }

  steps.push({
    title: 'Verify and document',
    description: 'Get the build green, update the README with current setup instructions, and set up CI so the project stays alive.',
  });

  return steps;
}
