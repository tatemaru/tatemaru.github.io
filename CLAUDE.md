# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal daily blog built using Hono for static site generation (SSG). The blog is designed to record daily events and is hosted on GitHub Pages with automatic deployment.

## Architecture

- **Framework**: Hono (TypeScript web framework) + Vite dev server
- **Content Management**: MDX files with front matter
- **Components**: React TSX components for modular design
- **Deployment**: Static site generation to GitHub Pages
- **Styling**: Tailwind CSS with Japanese language support
- **Build System**: TypeScript with tsx runner and Vite bundling

## Development Commands

```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Build static site for production
npm run build

# Preview built site locally
npm run preview

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── app.tsx         # Main Hono application with routes
├── generator.ts    # Static site generation script
├── components/     # React TSX components
│   ├── Header.tsx  # Site header component
│   ├── Footer.tsx  # Site footer component
│   ├── PostCard.tsx # Blog post card component
│   ├── PostGrid.tsx # Grid layout for post cards
│   └── Tag.tsx     # Tag component
├── layouts/        # Page layout components
│   ├── BaseLayout.tsx # Base HTML layout
│   └── PostLayout.tsx # Individual post layout
├── pages/          # Page components
│   └── HomePage.tsx # Home page component
└── utils/
    └── posts.ts    # Post management utilities

content/            # MDX blog posts organized by date
├── 2024/
│   ├── 01/
│   │   ├── blog-start.mdx
│   │   └── daily-life.mdx
│   └── 06/
│       └── learning.mdx
└── [year]/[month]/ # Year/month directory structure

public/
├── css/           # Stylesheets
├── images/        # Blog images
└── videos/        # Blog videos

dist/              # Generated static files (GitHub Pages)
```

## Content Management

### Writing Posts

Create `.mdx` files in `content/[year]/[month]/` directory structure:

**Directory Structure:**
- `content/2024/01/blog-start.mdx`
- `content/2024/06/learning.mdx`

**Example front matter:**
```yaml
---
title: "記事のタイトル"
excerpt: "記事の要約（省略可能）"
tags: ["技術", "ブログ", "開発"]
thumbnail: "/images/filename.jpg"
created_at: "2024-01-15"
updated_at: "2024-01-15"
---
```

**Required Properties:**
- `title`: Post title
- `excerpt`: Brief description for post preview
- `tags`: Array of tags for categorization
- `thumbnail`: Path to thumbnail image (defaults to placeholder if not specified)
- `created_at`: Creation date (YYYY-MM-DD format)
- `updated_at`: Last modification date (YYYY-MM-DD format)

**MDX Features:**
- Full Markdown syntax support
- React component integration capability
- JavaScript expressions in content

### Static Assets

- Images: Place in `public/images/`, reference as `/images/filename.jpg`
- Videos: Place in `public/videos/`, reference as `/videos/filename.mp4`
- CSS: Main stylesheet is `public/css/style.css`

## Deployment

- **Automatic**: Push to `main` branch triggers GitHub Actions deployment
- **Manual**: Run `npm run build` and commit `dist/` folder
- **URL**: GitHub Pages serves from `/dist` directory

## Key Features

- Japanese language support (ja-JP locale)
- Responsive three-column card layout for blog posts
- **TSX Component Architecture**: Modular React components
- **MDX Content**: Enhanced Markdown with React component support
- **Year/Month Organization**: Content organized by date in directory structure
- Tailwind CSS styling with custom components
- SEO-friendly with sitemap generation
- Tag system for categorizing posts
- Thumbnail images for post previews
- Created/updated date tracking
- Clean, modern design focused on readability

## Development Notes

- Uses TypeScript with strict type checking and JSX support
- React TSX components for modular design
- Hot reload during development with `npm run dev`
- Static files are copied to `dist/` during build
- Sitemap automatically generated for all posts
- Posts sorted by date (newest first) on home page
- MDX files support React components within content
- Automatic directory traversal for year/month content structure

## Component Structure

- **Components**: Reusable UI components (Header, Footer, PostCard, etc.)
- **Layouts**: Page layout wrappers (BaseLayout, PostLayout)
- **Pages**: Full page components (HomePage)
- **Utils**: Utility functions for post management