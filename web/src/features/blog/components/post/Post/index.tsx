import type { Post as PostType } from '@/features/blog/types';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Image from 'next/image';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Mdx } from '../Mdx';
import styles from './markdown.module.scss';

type Props = {
  post: PostType;
};

export const Post = ({ post }: Props): JSX.Element => (
  <main style={{ maxWidth: '90rem', margin: '0 auto', padding: '32px 16px' }}>
    <a
      href='/blog'
      style={{ fontSize: 14, color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}
    >
      ← ブログ一覧へ
    </a>

    <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.6)', marginTop: 16 }}>
      {post.frontmatter.date}
    </div>

    <h1
      style={{ fontSize: 32, fontWeight: 800, marginTop: 8, marginBottom: 0 }}
    >
      {post.frontmatter.title}
    </h1>

    {post.frontmatter.description ? (
      <p style={{ marginTop: 16, fontSize: 18, color: 'rgba(0,0,0,0.75)' }}>
        {post.frontmatter.description}
      </p>
    ) : null}

    {post.frontmatter.coverImage ? (
      <div
        style={{
          marginTop: 24,
          position: 'relative',
          width: '100%',
          height: 400,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Image
          src={post.frontmatter.coverImage}
          alt={post.frontmatter.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    ) : null}

    <hr
      style={{
        margin: '32px 0',
        border: 0,
        borderTop: '1px solid rgba(0,0,0,0.12)',
      }}
    />

    <article
      style={{ lineHeight: 1.9, fontSize: 16 }}
      className={styles.markdown}
    >
      <MDXRemote
        source={post.content}
        components={Mdx}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
          },
        }}
      />
    </article>
  </main>
);
