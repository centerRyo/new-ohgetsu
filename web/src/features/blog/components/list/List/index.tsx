import { Post } from '@/features/blog/types';
import { SimpleGrid } from '@chakra-ui/react';
import { Card } from '../Card';

type Props = {
  posts: Post[];
};

export const List = ({ posts }: Props): JSX.Element => (
  <SimpleGrid columns={1} spacing={4} mt={6}>
    {posts.map((post) => (
      <Card key={post.slug} post={post} />
    ))}
  </SimpleGrid>
);
