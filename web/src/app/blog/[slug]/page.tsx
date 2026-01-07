import { SERVICE_NAME } from '@/constants';
import { getAllSlugs, getPostBySlug } from '@/features/blog/api/repository';
import { PostPage } from '@/features/blog/components/pages/PostPage';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export const generateStaticParams = () => {
  return getAllSlugs().map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const slug = params.slug;

  try {
    const post = getPostBySlug(slug);

    const title = `${post.frontmatter.title} | アレルギー外食ガイド | ${SERVICE_NAME}`;
    const description = post.frontmatter.description ?? '';

    const canonicalUrl = `https://ohgetsu.com/blog/${slug}`;

    return {
      title,
      description,

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: true,
        follow: true,
      },

      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: SERVICE_NAME,
        type: 'article',
        publishedTime: post.frontmatter.date,
        tags: post.frontmatter.tags,
      },

      twitter: {
        title,
        description,
      },

      keywords: post.frontmatter.tags,
    };
  } catch {
    const notFoundUrl = `https://ohgetsu.com/blog/${slug}`;

    return {
      title: `Not Found | ${SERVICE_NAME}`,
      alternates: { canonical: notFoundUrl },
      robots: { index: false, follow: false },
    };
  }
};

const Page = ({ params }: Props): JSX.Element => (
  <PostPage slug={params.slug} />
);

export default Page;
