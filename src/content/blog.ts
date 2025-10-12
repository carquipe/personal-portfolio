// src/content/blog.ts
import { BlogRepository } from "@features/blog/repositories/BlogRepository";
import type { NotionBlogPost } from "@features/blog/models/NotionBlogPost";

let cachedPosts: NotionBlogPost[] | null = null;

/**
 * Returns all published blog posts, cached for the entire build.
 */
export async function getAllPosts(): Promise<NotionBlogPost[]> {
  if (!cachedPosts) {
    cachedPosts = await BlogRepository.getPublishedPosts();
  }
  return cachedPosts;
}

/**
 * Returns a single blog post by its slug, resolved from the cached list.
 */
export async function getPostBySlug(slug: string): Promise<NotionBlogPost | null> {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  console.log(post?.content);
  return post ?? null;
}