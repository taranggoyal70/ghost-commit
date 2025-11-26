import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface AnalysisResult {
  success: boolean;
  repository: {
    owner: string;
    name: string;
    fullName: string;
    description: string;
    stars: number;
    language: string;
    lastCommit: string;
    daysSinceLastCommit: number;
    isDead: boolean;
  };
  analysis: {
    framework: string;
    scenario: string;
    packageJson: any;
    fileStructure: any[];
    hasTests: boolean;
    hasDocker: boolean;
    hasCI: boolean;
    issues: any[];
    issueCount: number;
  };
  recommendations: {
    scenario: string;
    priority: string;
    estimatedTime: string;
  };
}

export interface ResurrectionResult {
  success: boolean;
  sessionId: string;
  steps: Array<{
    id: string;
    title: string;
    status: string;
    details: string;
  }>;
  result: {
    transformations: string[];
    filesModified: string[];
    deploymentUrl: string;
    prUrl: string;
  };
}

export class APIClient {
  /**
   * Analyze a GitHub repository
   */
  static async analyzeRepository(repoUrl: string): Promise<AnalysisResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
        repoUrl,
      });
      return response.data;
    } catch (error: any) {
      console.error('Analysis failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to analyze repository');
    }
  }

  /**
   * Start resurrection process
   */
  static async startResurrection(
    repoUrl: string,
    scenario: string
  ): Promise<ResurrectionResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/resurrect`, {
        repoUrl,
        scenario,
      });
      return response.data;
    } catch (error: any) {
      console.error('Resurrection failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to start resurrection');
    }
  }

  /**
   * Get resurrection status
   */
  static async getStatus(sessionId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/status`, {
        params: { sessionId },
      });
      return response.data;
    } catch (error: any) {
      console.error('Status check failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to get status');
    }
  }

  /**
   * Update resurrection status
   */
  static async updateStatus(
    sessionId: string,
    step: any,
    status: string,
    details?: string
  ): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/status`, {
        sessionId,
        step,
        status,
        details,
      });
      return response.data;
    } catch (error: any) {
      console.error('Status update failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to update status');
    }
  }
}

export default APIClient;
