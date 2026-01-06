import { SERVICE_NAME } from '@/constants';
import { getAllSlugs, getPostBySlug } from '@/features/blog/api/repository';
import { PostPage } from '@/features/blog/components/pages/PostPage';

type Props = {
  params: { slug: string };
};

export const generateStaticParams = () => {
  return getAllSlugs().map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props) => {
  try {
    const post = getPostBySlug(params.slug);

    return {
      title: `${post.frontmatter.title} | ブログ | ${SERVICE_NAME}`,
      description: post.frontmatter.description ?? '',
    };
  } catch {
    return { title: `Not Found | ${SERVICE_NAME}` };
  }
};

const Page = ({ params }: Props): JSX.Element => (
  <PostPage slug={params.slug} />
);

export default Page;
