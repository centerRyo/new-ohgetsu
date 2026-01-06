import type { ComponentProps, JSX } from 'react';

type MarkdownAnchorProps = ComponentProps<'a'> & { href?: string };

type MarkdownImageProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  src?: string;
  alt?: string;
};

const isExternalHttpUrl = (href: string): boolean => {
  if (href.startsWith('/')) return false;
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const parsedUrl = new URL(href);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const mergeRelForExternalLink = (existingRel: string | undefined): string => {
  const relTokens = new Set(
    (existingRel ?? '')
      .split(' ')
      .map((token) => token.trim())
      .filter(Boolean)
  );

  relTokens.add('noreferrer');
  relTokens.add('noopener');

  return Array.from(relTokens).join(' ');
};

const AnchorLink = ({
  href,
  rel,
  target,
  ...restProps
}: MarkdownAnchorProps): JSX.Element => {
  if (!href) return <a {...restProps} />;

  if (isExternalHttpUrl(href)) {
    const safeRel = mergeRelForExternalLink(rel);
    const safeTarget = target ?? '_blank';
    return <a {...restProps} href={href} target={safeTarget} rel={safeRel} />;
  }

  return <a {...restProps} href={href} rel={rel} target={target} />;
};

const MarkdownImage = ({
  src,
  alt,
  style,
  loading,
  ...restProps
}: MarkdownImageProps): JSX.Element => {
  if (!src || src.trim().length === 0) return <></>;

  const mergedStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 12,
    display: 'block',
    margin: '24px 0', // 画像自体に余白をつける（figure不要）
    ...style,
  };

  return (
    <img
      {...restProps}
      src={src}
      alt={alt ?? ''}
      loading={loading ?? 'lazy'}
      decoding='async'
      style={mergedStyle}
    />
  );
};

export const Mdx = {
  a: AnchorLink,
  img: MarkdownImage,
};
