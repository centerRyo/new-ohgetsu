export type Frontmatter = {
  title: string;
  description?: string;
  date: string; // ISO "YYYY-MM-DD"
  tags?: string[];
  coverImage?: string;
};

export type Post = {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
};
