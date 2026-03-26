import { getPostBySlug } from '@/features/blog/api/repository';
import { notFound } from 'next/navigation';
import { Post } from '../../post/Post';

export const PostPage = ({ slug }: { slug: string }) => {
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    return notFound();
  }

  return <Post post={post} />;
};
