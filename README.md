# contributions-status

GitHubとGitLabのcontributionデータを統合して、365日分のグラフ画像を生成するWebアプリケーションです。  
[![Contributions Graph](https://contributions-status-server.vercel.app/api/contributions?gitlab=T4ko0522&github=T4ko0522&theme=pink)](https://contributions-status-server.vercel.app)

## 機能

- GitHubとGitLabのcontributionデータを統合表示
- 7種類のテーマ（default, gitlab, blue, purple, orange, red, pink）
- 365日分のcontributionグラフを画像として生成
- リアルタイムでのバックエンドステータス確認

## 技術スタック

### フロントエンド
- React 19
- Vite
- Tailwind CSS

### バックエンド
- Node.js
- Express 5
- TypeScript
- @napi-rs/canvas（画像生成）

## API エンドポイント

### GET /api/contributions

GitHubとGitLabのcontributionを統合した365日のグラフ画像を返します。

#### クエリパラメータ

- `github` (オプション): GitHubのユーザー名
- `gitlab` (オプション): GitLabのユーザー名
- `theme` (オプション): テーマ（default, gitlab, blue, purple, orange, red, pink）デフォルトは`default`

**注意**: `github`と`gitlab`の少なくとも一方は必須です。

#### 使用例

```
GET /api/contributions?github=T4ko0522&gitlab=T4ko0522&theme=pink
```

#### レスポンス

- Content-Type: `image/png`
- Cache-Control: `public, max-age=3600` (1時間キャッシュ)

## ライセンス

このプロジェクトは [Apache License 2.0](LICENSE) の下で公開されています。

## 作者

T4ko0522

## リンク

- [GitHub Repository](https://github.com/T4ko0522/contributions-status)
- [デモサイト](https://contributions-status-server.vercel.app/)
