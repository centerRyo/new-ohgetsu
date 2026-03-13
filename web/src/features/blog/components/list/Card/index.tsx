'use client';

import { Post } from '@/features/blog/types';
import {
  Box,
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
    overflow='hidden'
    _hover={{ shadow: 'md' }}
  >
    {post.frontmatter.coverImage && (
      <Box position='relative' w='full' paddingTop='56.25%'>
        <Image
          src={post.frontmatter.coverImage}
          alt={post.frontmatter.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
    )}

    <Box p={4}>
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
  </LinkBox>
);
