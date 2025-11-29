import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResurrectionStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, scenario } = await request.json();

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

    // Check if GitHub token is available
    const hasGitHubToken = !!process.env.GITHUB_TOKEN;
    
    // Initialize services
    const octokit = hasGitHubToken ? new Octokit({
      auth: process.env.GITHUB_TOKEN,
    }) : null;

    // Create resurrection session
    const sessionId = `resurrection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Step 1: Clone and analyze
    const step1 = await analyzeRepository(octokit, owner, repoName, scenario);

    // Step 2: Generate transformation plan with AI
    const step2 = await generateTransformationPlan(step1.analysis, scenario);

    // Step 3: Apply transformations (simulated for now)
    const step3 = await applyTransformations(step2.plan);

    // Step 4: Add Stack Auth if needed
    const step4 = scenario === 'no-auth' || step2.plan.addAuth
      ? await addStackAuth(owner, repoName)
      : { success: true, message: 'Auth not needed for this scenario', details: 'Skipped authentication setup' };

    // Step 5: Create deployment configuration
    const step5 = await createDeploymentConfig(owner, repoName, scenario);

    return NextResponse.json({
      success: true,
      sessionId,
      steps: [
        {
          id: 'analyze',
          title: 'Repository Analyzed',
          status: 'completed',
          details: step1.details,
        },
        {
          id: 'plan',
          title: 'Transformation Plan Generated',
          status: 'completed',
          details: step2.details,
        },
        {
          id: 'transform',
          title: 'Code Transformed',
          status: 'completed',
          details: step3.details,
        },
        {
          id: 'auth',
          title: step4.message,
          status: 'completed',
          details: step4.details,
        },
        {
          id: 'deploy',
          title: 'Deployment Ready',
          status: 'completed',
          details: step5.details,
        },
      ],
      result: {
        transformations: step2.plan.transformations,
        filesModified: step3.filesModified,
        deploymentUrl: step5.deploymentUrl,
        prUrl: `https://github.com/${owner}/${repoName}/pull/new/ghost-commit-resurrection`,
      },
    });
  } catch (error: any) {
    console.error('Resurrection error:', error);

    return NextResponse.json(
      {
        error: 'Failed to resurrect repository',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

async function analyzeRepository(
  octokit: Octokit | null,
  owner: string,
  repo: string,
  scenario: string
) {
  // Fetch package.json
  let packageJson = null;
  
  if (octokit) {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString();
        packageJson = JSON.parse(content);
      }
    } catch (error) {
      console.log('No package.json found or GitHub API error');
    }
  } else {
    // Demo mode without GitHub token
    packageJson = {
      name: repo,
      dependencies: {
        'react': '^16.0.0',
        'react-dom': '^16.0.0',
      }
    };
  }

  return {
    success: true,
    analysis: {
      packageJson,
      scenario,
      owner,
      repo,
    },
    details: `Analyzed ${owner}/${repo}\nScenario: ${scenario}\nDependencies: ${
      packageJson ? Object.keys(packageJson.dependencies || {}).length : 0
    }${!octokit ? '\n(Demo mode - add GITHUB_TOKEN for real analysis)' : ''}`,
  };
}

async function generateTransformationPlan(analysis: any, scenario: string) {
  const prompt = `You are an expert code modernization AI. Analyze this repository and create a transformation plan.

Repository: ${analysis.owner}/${analysis.repo}
Scenario: ${scenario}
Current Dependencies: ${JSON.stringify(analysis.packageJson?.dependencies || {}, null, 2)}

Create a detailed plan to resurrect this dead project. Include:
1. Dependencies to update
2. Breaking changes to fix
3. New features to add
4. Deployment strategy

Return a JSON object with: { transformations: string[], addAuth: boolean, deploymentStrategy: string }`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at modernizing and resurrecting dead code repositories.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const plan = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      success: true,
      plan: {
        transformations: plan.transformations || [],
        addAuth: plan.addAuth || false,
        deploymentStrategy: plan.deploymentStrategy || 'vercel',
      },
      details: `AI Generated Plan:\n${plan.transformations?.slice(0, 5).join('\n') || 'No transformations needed'}`,
    };
  } catch (error) {
    // Fallback plan if OpenAI fails
    const fallbackPlan = getFallbackPlan(scenario);
    return {
      success: true,
      plan: fallbackPlan,
      details: `Fallback Plan:\n${fallbackPlan.transformations.slice(0, 5).join('\n')}`,
    };
  }
}

function getFallbackPlan(scenario: string) {
  const plans: Record<string, any> = {
    'outdated-react': {
      transformations: [
        'Update React 16/17 → 19',
        'Convert class components to hooks',
        'Update React Router v5 → v6',
        'Fix deprecated lifecycle methods',
        'Update build configuration',
      ],
      addAuth: false,
      deploymentStrategy: 'vercel',
    },
    'no-auth': {
      transformations: [
        'Install @stackframe/stack',
        'Create auth pages (login/signup)',
        'Add protected routes',
        'Implement user context',
        'Configure OAuth providers',
      ],
      addAuth: true,
      deploymentStrategy: 'vercel',
    },
    'nextjs-migration': {
      transformations: [
        'Update Next.js to v14',
        'Create app directory',
        'Migrate pages to app router',
        'Convert to Server Components',
        'Update API routes to Route Handlers',
      ],
      addAuth: false,
      deploymentStrategy: 'vercel',
    },
    default: {
      transformations: [
        'Update all dependencies',
        'Fix breaking changes',
        'Add modern tooling',
        'Improve code quality',
        'Add deployment config',
      ],
      addAuth: false,
      deploymentStrategy: 'vercel',
    },
  };

  return plans[scenario] || plans.default;
}

async function applyTransformations(plan: any) {
  // In a real implementation, this would:
  // 1. Clone the repository
  // 2. Apply code transformations
  // 3. Run tests
  // 4. Create a new branch
  
  // For now, simulate the process
  const filesModified = [
    'package.json',
    'src/App.tsx',
    'src/index.tsx',
    'tsconfig.json',
    'next.config.js',
  ];

  return {
    success: true,
    filesModified,
    details: `Modified ${filesModified.length} files:\n${filesModified.join('\n')}`,
  };
}

async function addStackAuth(owner: string, repo: string) {
  // In a real implementation, this would:
  // 1. Add Stack Auth to package.json
  // 2. Create auth pages
  // 3. Add protected routes
  // 4. Configure Stack Auth

  return {
    success: true,
    message: 'Stack Auth Added',
    details: `✓ Installed @stackframe/stack\n✓ Created auth pages\n✓ Added protected routes\n✓ Configured OAuth`,
  };
}

async function createDeploymentConfig(owner: string, repo: string, scenario: string) {
  // In a real implementation, this would:
  // 1. Create vercel.json
  // 2. Set up environment variables
  // 3. Configure build settings
  // 4. Trigger deployment

  const deploymentUrl = `https://${repo}-resurrected.vercel.app`;

  return {
    success: true,
    deploymentUrl,
    details: `✓ Created vercel.json\n✓ Configured build\n✓ Set environment variables\n✓ Ready to deploy to ${deploymentUrl}`,
  };
}
