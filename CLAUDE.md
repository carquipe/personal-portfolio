# CLAUDE.md - Personal Portfolio Website

> **Project**: Carlos Quinza's Personal Portfolio & Blog
> **Tech Stack**: Astro 5.16 + React 19 + TailwindCSS 4 + Local Markdown
> **Site**: https://carlosquinza.es

---

## Project Overview

This is a professional personal portfolio and blog website built with modern web technologies. The site uses local markdown files for blog content, renders it as static pages with optimal SEO, and showcases professional achievements, skills, and work history.

### Key Features
- Static site generation with Astro for maximum performance
- Markdown-powered blog with frontmatter-based content management
- Comprehensive SEO with JSON-LD structured data
- Dynamic sitemap and robots.txt generation
- Dark mode support with TailwindCSS v4
- Responsive design with mobile-first approach
- Type-safe TypeScript with strict mode

---

## Architecture

### Directory Structure

```
/src
├── /app                    # Application infrastructure
│   ├── /layout            # Root layout components
│   └── /styles            # Global styles and theme
├── /assets                # Static assets (images, fonts, icons)
├── /core                  # Core domain logic
│   └── /markdown          # Markdown processing
│       ├── /services      # MarkdownReader service
│       └── /converters    # Markdown to HTML conversion
├── /features              # Feature modules
│   ├── /home              # Home page sections
│   └── /blog              # Blog feature
│       ├── /pages         # Page containers
│       ├── /components    # UI components
│       ├── /repositories  # Data access layer
│       ├── /mappers       # Data transformation
│       ├── /models        # Domain models
│       └── /utils         # Helpers
├── /shared                # Shared components
│   └── /components        # Header, Footer, SEO, etc.
├── /content               # Content API layer
└── /pages                 # Astro routing
```

### Architectural Patterns

**Repository Pattern**
Data access is abstracted through repository classes:
- `BlogRepository.getPublishedPosts()` - Fetches and transforms blog data
- Handles caching, error handling, and data normalization
- Returns strongly-typed domain models

**Mapper Pattern**
Markdown frontmatter data is transformed into domain models:
- `MarkdownBlogMapper.mapMarkdownToBlogPost()` - Markdown file → BlogPost
- Handles frontmatter extraction, defaults, and type safety

**Service Layer**
Markdown file reading and processing:
- `MarkdownReader` - Reads markdown files from `/content/posts/`
- Parses frontmatter using gray-matter
- Returns structured data for transformation

**Converter Pipeline**
Markdown to HTML processing:
1. Markdown files → Frontmatter + Content (`MarkdownReader`)
2. Markdown → HTML with plugins (`MarkdownToHtml`)
3. Supports GitHub Flavored Markdown, code highlighting, and more

---

## Code Conventions

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `BlogGrid.tsx`, `SEOHead.astro` |
| Interfaces/Types | PascalCase | `BlogPost`, `SitemapEntry` |
| Classes | PascalCase | `BlogRepository`, `MarkdownReader` |
| Functions | camelCase | `getAllPosts()`, `generateSlug()` |
| Variables | camelCase | `cachedPosts`, `selectedCategory` |
| Environment | UPPER_SNAKE_CASE | `SITE_URL`, `NODE_ENV` |
| CSS Classes | kebab-case | `.nav-links`, `.mobile-nav` |
| File paths | kebab-case | `blog/[slug].astro` |

### TypeScript Path Aliases

Always use these aliases for clean imports:

```typescript
@app/*         → ./src/app/*
@assets/*      → ./src/assets/*
@core/*        → ./src/core/*
@features/*    → ./src/features/*
@shared/*      → ./src/shared/*
@styles/*      → ./src/app/styles/*
@images/*      → ./src/assets/images/*
@icons/*       → ./src/assets/icons/*
@fonts/*       → ./src/assets/fonts/*
@markdown/*    → ./src/core/markdown/*
@content/*     → ./src/content/*
```

**Example:**
```typescript
// ✅ Good
import { BlogRepository } from '@features/blog/repositories/BlogRepository';
import { SEOHead } from '@shared/components/SEOHead.astro';

// ❌ Bad
import { BlogRepository } from '../../../features/blog/repositories/BlogRepository';
```

### Component Patterns

**Astro Components** (`.astro` files)
- Server-side rendered by default
- Use for static content and layouts
- Include scoped CSS with `<style>` tags
- Export `getStaticPaths()` for dynamic routes

**React Components** (`.tsx` files)
- Use for interactive features requiring state
- Hydrate strategically with directives:
  - `client:visible` - Load when in viewport
  - `client:load` - Load immediately
  - `client:idle` - Load when page idle
- Example: `BlogGrid.tsx` uses category filtering with URL state

### File Organization

- **One component per file** - Component name matches filename
- **Colocate related code** - Keep mappers, models, and repositories together
- **Separate concerns** - Data access (repositories) vs presentation (components)
- **Feature-based structure** - Blog feature is self-contained in `/features/blog`

---

## Development Guidelines

### TypeScript

- **Strict mode enabled** - All strict checks enforced
- **Explicit types** - Define interfaces for all data models
- **No `any`** - Use `unknown` if type is truly unknown
- **Interface over type** - Prefer `interface` for object shapes

### Styling

**TailwindCSS v4**
- Use Tailwind utility classes for all styling
- Custom colors defined in `tailwind.config.js`
- Dark mode via `.dark` class toggle
- Responsive: mobile-first with `md:` and `lg:` breakpoints

**Custom Fonts**
- **Mona Sans** - Headers and display text
- **Hubot Sans** - Body text and UI
- Variable fonts with weights 200-900

**CSS Custom Properties**
```css
--color-primary
--color-background
--color-surface
```

### Performance

**Image Optimization**
- Use `astro:assets` for automatic optimization
- Provide `alt` text for accessibility
- Use `loading="lazy"` for below-fold images

**Caching Strategy**
- Blog posts cached during build in `cachedPosts` variable
- Prevents redundant file reads during build
- Sitemap/robots cached at CDN (1 hour local, 1 day CDN)

**Static Generation**
- All blog pages pre-rendered at build time
- Dynamic routes via `getStaticPaths()`
- No client-side data fetching for content

### Error Handling

- Use try-catch in repositories and services
- Provide sensible fallbacks (empty arrays, default values)
- Log errors for debugging but don't expose internals to users

**Example:**
```typescript
export class BlogRepository {
  static async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      // ... fetch and process
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return []; // Graceful fallback
    }
  }
}
```

---

## SEO Best Practices

### Meta Tags (SEOHead.astro)

Every page must include comprehensive meta tags:
- **Title** - Unique, descriptive, under 60 characters
- **Description** - Compelling summary, 150-160 characters
- **Open Graph** - For social media sharing (Facebook, LinkedIn)
- **Twitter Card** - Large image card format
- **Canonical URL** - Prevent duplicate content issues
- **Language** - `hreflang` for Spanish (es-ES) and default (x-default)

### Structured Data (StructuredData.astro)

Use JSON-LD schemas for rich search results:
- **Article** - Blog posts with author, publisher, keywords
- **Person** - Home page with skills, job title, contact
- **Website** - Site-wide with search action
- **BreadcrumbList** - Navigation hierarchy

**Example:**
```astro
<StructuredData
  type="article"
  title="My Blog Post"
  description="Post description"
  publishedDate="2024-01-15"
  tags={['web', 'astro']}
/>
```

### Sitemap & Robots

**Sitemap** (`sitemap.xml.ts`)
- Auto-generated from all routes
- Custom priorities: Home (1.0), Blog Index (0.9), Posts (0.7)
- Change frequency: Daily for blog, weekly for home
- Last modified dates from blog post dates

**Robots** (`robots.txt.ts`)
- Allow all crawlers by default
- Block: `_astro/`, `/api/`, `/.well-known/`
- Specific crawl delays per bot
- Block unwanted bots: AhrefsBot, MJ12bot, DotBot

---

## Content Management

### Environment Variables

Required environment variables (see `.env.template`):
```bash
SITE_URL=https://carlosquinza.es  # or http://localhost:4321 for dev
```

### Markdown File Structure

Blog posts are stored as markdown files in `/content/posts/`. Each file must include frontmatter with metadata.

**Required frontmatter fields:**
- **title** - Post title
- **description** - SEO description and excerpt
- **date** - Publication date (YYYY-MM-DD format)

**Optional frontmatter fields:**
- **slug** - URL slug (auto-generated from title if missing)
- **published** - Boolean (defaults to true)
- **coverImage** - Local path or external URL
- **tags** - Array of tag strings

**Example post** (`/content/posts/my-post.md`):
```yaml
---
title: "Getting Started with Astro"
slug: "getting-started-astro"
description: "Learn how to build blazing fast websites with Astro"
date: "2026-02-14"
published: true
coverImage: "/images/blog/astro-cover.jpg"
tags:
  - "Astro"
  - "Web Development"
---

# Your markdown content here

This is the post body with **markdown** formatting.
```

### Content API

**Getting all posts:**
```typescript
import { getAllPosts } from '@content/blog';

const posts = await getAllPosts(); // Returns BlogPost[]
```

**Getting single post:**
```typescript
import { getPostBySlug } from '@content/blog';

const post = await getPostBySlug('my-post-slug');
```

### Markdown Processing

The conversion pipeline handles:
- **GitHub Flavored Markdown** - Tables, task lists, strikethrough
- **Code blocks** - Syntax highlighting with language detection
- **Links** - Auto-linking with proper attributes
- **Images** - Optimized and lazy-loaded
- **Headings** - Auto-generated IDs for anchor links
- **HTML sanitization** - Safe rendering of user content

---

## Build & Deployment

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Vercel Deployment

**Configuration** (`vercel.json`):
- Framework: Astro (auto-detected)
- Build command: `pnpm run build`
- Install command: `pnpm install`

**Environment Variables**:
Set in Vercel dashboard:
- `SITE_URL` (https://carlosquinza.es)

**Deployment Trigger**:
- Auto-deploy on push to `main` branch
- Manual deploys via Vercel CLI

### Build Artifacts

- `/dist` - Production output
- `.astro` - Generated type definitions
- Do NOT commit: `node_modules`, `dist`, `.astro`

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `/src/pages/index.astro` | Home page with sections |
| `/src/pages/blog/index.astro` | Blog listing page |
| `/src/pages/blog/[slug].astro` | Dynamic blog post pages |
| `/src/pages/sitemap.xml.ts` | Dynamic sitemap generation |
| `/src/pages/robots.txt.ts` | Crawler directives |
| `/src/content/blog.ts` | Blog content API |
| `/src/core/markdown/services/MarkdownReader.ts` | Markdown file reader |
| `/src/core/markdown/converters/MarkdownToHtml.ts` | Markdown to HTML converter |
| `/src/features/blog/repositories/BlogRepository.ts` | Blog data access |
| `/src/features/blog/mappers/MarkdownBlogMapper.ts` | Markdown to BlogPost mapper |
| `/src/shared/components/SEOHead.astro` | Meta tags |
| `/src/shared/components/StructuredData.astro` | JSON-LD schemas |
| `/content/posts/` | Markdown blog posts directory |
| `/astro.config.mjs` | Astro configuration |
| `/tailwind.config.js` | TailwindCSS configuration |
| `/tsconfig.json` | TypeScript configuration |

---

## Common Tasks

### Adding a New Blog Post

1. Create new markdown file in `/content/posts/` (e.g., `my-new-post.md`)
2. Add frontmatter with required fields (title, description, date)
3. Optionally add: slug, tags, coverImage, published
4. Write post content in markdown below frontmatter
5. Place any images in `/public/images/blog/`
6. Rebuild site to generate new page (`pnpm run build`)

### Adding a New Home Section

1. Create component in `/src/features/home/components/`
2. Import in `/src/features/home/pages/Home.astro`
3. Add to component sequence
4. Style with Tailwind utilities

### Modifying SEO

**Meta tags**: Edit `/src/shared/components/SEOHead.astro`
**Structured data**: Edit `/src/shared/components/StructuredData.astro`
**Sitemap**: Edit `/src/pages/sitemap.xml.ts`
**Robots**: Edit `/src/pages/robots.txt.ts`

### Adding New Fonts

1. Add font files to `/src/assets/fonts/`
2. Update `@font-face` declarations in global CSS
3. Add font family to Tailwind config
4. Use in components with Tailwind classes

---

## Troubleshooting

### Content Issues

**Posts not appearing**
- Verify frontmatter `published` field is not set to `false`
- Check frontmatter `date` is in correct format (YYYY-MM-DD)
- Ensure markdown file has `.md` extension
- Verify file is in `/content/posts/` directory
- Rebuild site to generate new pages

**Frontmatter parsing errors**
- Ensure frontmatter is wrapped in `---` delimiters
- Check YAML syntax is valid (proper indentation, colons)
- Verify arrays use proper YAML format (dash prefix)
- Check for special characters that need quoting

### Build Failures

**Error: "Module not found"**
- Check TypeScript path aliases in `tsconfig.json`
- Verify imports use correct alias (e.g., `@features/`)
- Run `pnpm install` to ensure dependencies installed

**Markdown conversion errors**
- Check markdown syntax is valid
- Verify code blocks use triple-fence syntax
- Ensure frontmatter YAML is properly formatted

### Styling Issues

**Dark mode not working**
- Ensure `.dark` class toggled on root element
- Verify color classes use dark: prefix
- Check custom properties defined in theme

**Fonts not loading**
- Verify font files in `/src/assets/fonts/`
- Check `@font-face` paths are correct
- Ensure `font-display: swap` for performance

---

## Best Practices Summary

✅ **DO:**
- Use TypeScript path aliases for all imports
- Write explicit types for all data models
- Use Astro components for static content
- Use React components only for interactivity
- Cache data during build to avoid redundant file reads
- Include comprehensive SEO meta tags on all pages
- Add JSON-LD structured data for rich results
- Optimize images with `astro:assets`
- Use mobile-first responsive design
- Handle errors gracefully with fallbacks
- Test locally before deploying

❌ **DON'T:**
- Use relative imports (`../../../`)
- Use `any` type in TypeScript
- Create new files when editing existing ones works
- Fetch content client-side (use static generation)
- Skip accessibility attributes (alt, aria-labels)
- Commit environment files (`.env`)
- Ignore TypeScript errors
- Use inline styles (use Tailwind instead)
- Hydrate React components unnecessarily
- Skip error handling in async operations

---

## Contact & Support

**Repository**: Internal project
**Owner**: Carlos Quinza
**Questions**: Check documentation or existing code patterns

---

*This CLAUDE.md was auto-generated from codebase analysis. Keep it updated as the project evolves.*
