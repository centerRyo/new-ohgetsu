import { getPostBySlug } from '@/features/blog/api/repository';
import { notFound } from 'next/navigation';
import { Post } from '../../post/Post';

export const PostPage = ({ slug }: { slug: string }) => {
  try {
    const post = getPostBySlug(slug);

    return <Post post={post} />;
  } catch {
    return notFound();
  }
};
