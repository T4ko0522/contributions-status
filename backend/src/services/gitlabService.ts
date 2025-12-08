import axios, { type AxiosInstance } from 'axios';

interface GitLabContribution {
  date: string;
  count: number;
}

class GitLabService {
  private client: AxiosInstance;

  constructor() {
    // calendar.jsonは認証不要なので、シンプルなクライアントを使用
    this.client = axios.create({
      baseURL: 'https://gitlab.com',
    });
  }

  /**
   * GitLabのcontributionデータを取得
   * @param username - GitLabのユーザー名
   * @returns 365日分のcontributionデータ
   */
  async getContributions(username: string): Promise<GitLabContribution[]> {
    try {
      // GitLabのcalendar.jsonエンドポイントから直接取得
      const response = await axios.get(
        `https://gitlab.com/users/${username}/calendar.json`
      );

      // レスポンスは { "YYYY-MM-DD": count } の形式
      const calendarData: Record<string, number> = response.data;

      // 過去365日分のデータを作成
      const contributions: GitLabContribution[] = [];
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);

      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr: string = date.toISOString().split('T')[0] ?? '';
        const count: number = calendarData[dateStr] ?? 0;
        contributions.push({
          date: dateStr,
          count,
        });
      }

      return contributions;
    } catch (error) {
      console.error('GitLab contribution取得エラー:', error);
      return [];
    }
  }
}

export default new GitLabService();

