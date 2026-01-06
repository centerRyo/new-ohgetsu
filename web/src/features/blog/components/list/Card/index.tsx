'use client';

import { Post } from '@/features/blog/types';
import {
  Box,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';

type Props = {
  post: Post;
};

export const Card = ({ post }: Props): JSX.Element => (
  <LinkBox
    as='article'
    borderWidth='1px'
    borderRadius='lg'
    p={4}
    _hover={{ shadow: 'md' }}
  >
    <Flex gap={4} align='flex-start'>
      {post.frontmatter.coverImage && (
        <Box
          position='relative'
          w='160px'
          h='100px'
          flexShrink={0}
          borderRadius='md'
          overflow='hidden'
        >
          <Image
            src={post.frontmatter.coverImage}
            alt={post.frontmatter.title}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      )}

      <Box flex='1'>
        <Text fontSize='sm' color='gray.500'>
          {post.frontmatter.date}
        </Text>

        <Heading size='md' mt={1}>
          <LinkOverlay as={NextLink} href={`/blog/${post.slug}`}>
            {post.frontmatter.title}
          </LinkOverlay>
        </Heading>

        {post.frontmatter.description && (
          <Text mt={2} color='gray.700'>
            {post.frontmatter.description}
          </Text>
        )}

        {post.frontmatter.tags && (
          <HStack mt={3} spacing={2} wrap='wrap'>
            {post.frontmatter.tags.map((tag) => (
              <Tag key={tag} size='sm'>
                {tag}
              </Tag>
            ))}
          </HStack>
        )}
      </Box>
    </Flex>
  </LinkBox>
);
