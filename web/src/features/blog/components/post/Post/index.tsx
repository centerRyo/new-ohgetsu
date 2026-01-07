import type { Post as PostType } from '@/features/blog/types';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Image from 'next/image';
import Link from 'next/link';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createMdxComponents } from '../Mdx';
import styles from './markdown.module.scss';
import navStyles from './navigation.module.scss';

const getFirstMarkdownImageSrc = (markdown: string): string | null => {
  const match = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (!match) return null;

  const src = match[1]?.trim();
  return src && src.length > 0 ? src : null;
};

type Props = {
  post: PostType;
};

export const Post = ({ post }: Props): JSX.Element => {
  const firstMarkdownImageSrc = getFirstMarkdownImageSrc(post.content);
  const mdxComponents = createMdxComponents({
    priorityImageSrc: firstMarkdownImageSrc,
  });

  return (
    <main style={{ maxWidth: '90rem', margin: '0 auto', padding: '32px 0' }}>
      <Link href='/blog' className={navStyles.backLink}>
        <span className={navStyles.arrow}>←</span>
        記事一覧へ戻る
      </Link>

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
          components={mdxComponents}
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

      <hr style={{ margin: '48px 0 24px' }} />

      <Link href='/blog' className={navStyles.backLink}>
        ← 記事一覧へ戻る
      </Link>
    </main>
  );
};
