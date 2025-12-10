import express from 'express';
import type { Request, Response, Router } from 'express';
import githubService from '../services/githubService.js';
import gitlabService from '../services/gitlabService.js';
import graphGenerator from '../services/graphGenerator.js';

const router: Router = express.Router();

type Theme = 'default' | 'gitlab' | 'orange' | 'red' | 'pink';

/**
 * GitHubとGitLabのcontributionを統合した365日のグラフ画像を返す
 * クエリパラメータ:
 * - github: GitHubのユーザー名（オプション）
 * - gitlab: GitLabのユーザー名（オプション）
 * - theme: テーマ（default, gitlab, orange, red, pink）デフォルトはdefault
 * 注意: githubとgitlabの少なくとも一方は必須
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { github, gitlab, theme } = req.query;

    // 少なくとも一方のユーザー名が必要
    if ((!github || typeof github !== 'string') && (!gitlab || typeof gitlab !== 'string')) {
      res.status(400).json({ error: 'At least one of github or gitlab username is required' });
      return;
    }

    // テーマの検証
    const validThemes: Theme[] = ['default', 'gitlab', 'orange', 'red', 'pink'];
    const selectedTheme: Theme =
      theme && typeof theme === 'string' && validThemes.includes(theme as Theme)
        ? (theme as Theme)
        : 'default';

    // GitHubとGitLabのcontributionデータを取得
    const [githubData, gitlabData] = await Promise.all([
      github && typeof github === 'string' ? githubService.getContributions(github) : Promise.resolve([]),
      gitlab && typeof gitlab === 'string' ? gitlabService.getContributions(gitlab) : Promise.resolve([]),
    ]);

    // グラフ画像を生成
    const imageBuffer = await graphGenerator.generateGraph(githubData, gitlabData, selectedTheme);

    // デプロイごとにキャッシュを無効化するため、ETagにデプロイIDを含める
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || 'dev';
    const etag = `"${deploymentId}-${imageBuffer.length}"`;
    
    // If-None-Matchヘッダーをチェックして304を返す
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    // 画像として返す
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate'); // 1時間キャッシュ、再検証必須
    res.setHeader('ETag', etag);
    res.send(imageBuffer);
  } catch (error) {
    console.error('Contribution graph生成エラー:', error);
    res.status(500).json({ error: 'Failed to generate contribution graph' });
  }
});

export default router;
