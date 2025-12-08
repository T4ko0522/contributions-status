import axios, { type AxiosInstance } from 'axios';

interface GitHubContribution {
  date: string;
  count: number;
}

class GitHubService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  }

  /**
   * GitHubのcontributionデータを取得
   * @param username - GitHubのユーザー名
   * @returns 365日分のcontributionデータ
   */
  async getContributions(username: string): Promise<GitHubContribution[]> {
    try {
      // GitHub GraphQL APIを使用してcontributionデータを取得
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      const token: string = process.env.GITHUB_TOKEN ?? '';
      const response = await this.client.post('https://api.github.com/graphql', {
        query,
        variables: { username },
      }, {
        headers: {
          'Authorization': token ? `token ${token}` : '',
        },
      });

      const weeks = response.data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
      const contributions: GitHubContribution[] = [];

      for (const week of weeks) {
        for (const day of week.contributionDays) {
          contributions.push({
            date: day.date,
            count: day.contributionCount,
          });
        }
      }

      return contributions;
    } catch (error) {
      console.error('GitHub contribution取得エラー:', error);
      return [];
    }
  }
}

export default new GitHubService();

