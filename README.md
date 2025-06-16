# たてまる blog

日々の出来事を記録するHonoX製静的サイト生成ブログです。

## 特徴

- 🚀 HonoXを使った高速な静的サイト生成
- 📝 MDXで記事を書く（Markdown + JSX）
- 🎨 Tailwind CSSによるモダンなデザイン
- 📱 レスポンシブ対応
- 🏷️ タグシステム・アーカイブ機能
- 🔄 GitHub Actionsでの自動デプロイ
- 🎯 カード全体クリック対応

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 静的サイトの生成
npm run build

# 生成されたサイトのプレビュー
npm run preview
```

## ブランチ構成

- **develop**: 開発ブランチ（ソースコード）
- **main**: 本番ブランチ（ビルド済みファイル）

## 開発フロー

```bash
# 1. developブランチで開発
git checkout develop

# 2. ローカル確認
npm run dev

# 3. 変更をコミット・プッシュ
git add .
git commit -m "新しい記事を追加"
git push origin develop

# 4. 自動デプロイ完了！（約2-3分）
```

developブランチにプッシュすると、GitHub Actionsが自動的にビルドしてmainブランチにデプロイします。

## 記事の書き方

`content/YYYY/MM/` ディレクトリに `.mdx` ファイルを作成してください。

### ディレクトリ構造
```
content/
  2024/
    01/
      blog-start.mdx
      daily-life.mdx
    06/
      learning.mdx
```

### Front Matter
```yaml
---
title: "記事のタイトル"
excerpt: "記事の要約"
tags: ["タグ1", "タグ2"]
thumbnail: "/images/thumbnail.jpg"
created_at: "2024-01-15"
updated_at: "2024-01-15"
---
```

### 例
```markdown
---
title: "今日の出来事"
excerpt: "今日は素晴らしい一日でした。"
tags: ["日常", "カフェ"]
thumbnail: "/images/cafe.jpg"
created_at: "2024-01-15"
updated_at: "2024-01-15"
---

# 今日の出来事

今日はカフェで読書をしました。

![カフェの写真](/images/cafe.jpg)

とても美味しいコーヒーでした！
```

## 画像・動画の追加

静的ファイルは `public/` ディレクトリに配置してください：

- 画像: `public/images/`
- 動画: `public/videos/`
- CSS: `public/css/`

## 機能詳細

### タグシステム
- ヘッダーの「Tags」ボタンでタグ一覧をモーダル表示
- タグクリックで該当記事にフィルタリング
- タグ別ページも自動生成

### アーカイブ機能
- ヘッダーの「Archive」ドロップダウンで年・月別表示
- 年別・月別ページも自動生成

### カード機能
- 記事カード全体がクリック可能
- ホバー時の視覚効果

## デプロイ

GitHub Pagesでの自動デプロイが設定されています。
- **develop**ブランチにプッシュ → 自動的にビルド・デプロイ
- **main**ブランチにビルド済みファイルが配置される
- URL: https://tatemaru.github.io/

## 技術スタック

- [HonoX](https://github.com/honojs/honox) - Full-stack web framework
- [Hono](https://hono.dev/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MDX](https://mdxjs.com/) - Markdown + JSX
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Front matter parser
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## プロジェクト構成

```
├── app/                    # HonoXアプリケーション
│   ├── components/         # Reactコンポーネント（Hono JSX）
│   ├── routes/            # ページルート
│   ├── layouts/           # レイアウトコンポーネント
│   ├── utils/             # ユーティリティ関数
│   └── constants/         # 定数定義
├── content/               # 記事コンテンツ（MDX）
│   └── YYYY/MM/          # 年/月ディレクトリ構造
├── public/               # 静的ファイル
├── scripts/              # ビルドスクリプト
└── .github/workflows/    # GitHub Actions