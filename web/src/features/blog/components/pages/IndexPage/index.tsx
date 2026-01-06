import { getAllPosts } from '@/features/blog/api/repository';
import { Box, Heading, Text } from '@chakra-ui/react';
import { List } from '../../list/List';

export const IndexPage = () => {
  const posts = getAllPosts();

  return (
    <Box maxW='90rem' mx='auto' px={4} py={8}>
      <Heading size='lg'>ブログ</Heading>
      <Text mt={2} color='gray.600'>
        アレルギーがある方の外食をラクにするための情報をまとめています
      </Text>

      <List posts={posts} />
    </Box>
  );
};
