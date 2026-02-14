import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownFile {
  frontmatter: Record<string, any>;
  content: string;
  filepath: string;
}

export class MarkdownReader {
  private static POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

  static async readAllPosts(): Promise<MarkdownFile[]> {
    try {
      const files = await fs.readdir(this.POSTS_DIR);
      const markdownFiles = files.filter(f => f.endsWith('.md'));

      const posts = await Promise.all(
        markdownFiles.map(file => this.readPostFile(file))
      );

      return posts;
    } catch (error) {
      console.error('Error reading markdown files:', error);
      return [];
    }
  }

  static async readPostBySlug(slug: string): Promise<MarkdownFile | null> {
    const allPosts = await this.readAllPosts();
    return allPosts.find(post => post.frontmatter.slug === slug) || null;
  }

  private static async readPostFile(filename: string): Promise<MarkdownFile> {
    const filepath = path.join(this.POSTS_DIR, filename);
    const fileContent = await fs.readFile(filepath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data,
      content,
      filepath
    };
  }
}
