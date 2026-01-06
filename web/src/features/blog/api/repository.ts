import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { Post } from '../types';

const BLOG_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'blog');

const getFilePathBySlug = (slug: string): string => {
  const mdx = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
  const md = path.join(BLOG_DIRECTORY, `${slug}.md`);

  if (fs.existsSync(mdx)) return mdx;
  if (fs.existsSync(md)) return md;

  throw new Error(`投稿が見つかりません: ${slug}`);
};

export const getAllSlugs = (): string[] => {
  const files = fs.readdirSync(BLOG_DIRECTORY);

  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.(mdx|md)$/, ''));
};

export const getPostBySlug = (slug: string): Post => {
  const filePath = getFilePathBySlug(slug);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  if (!data.title || !data.date) {
    throw new Error(`Frontmatter requires title & date: ${slug}`);
  }

  return {
    slug,
    frontmatter: {
      title: String(data.title),
      description: data.description ? String(data.description) : undefined,
      date: String(data.date),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
    },
    content,
  };
};

export const getAllPosts = (): Post[] => {
  const posts = getAllSlugs().map(getPostBySlug);

  const sortedPosts = posts.toSorted((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1
  );

  return sortedPosts;
};
