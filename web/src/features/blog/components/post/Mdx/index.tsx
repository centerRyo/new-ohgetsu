import Image from 'next/image';
import React from 'react';
import type { ComponentProps, JSX } from 'react';

type MarkdownAnchorProps = ComponentProps<'a'> & { href?: string };

type MarkdownImageProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  src?: string;
  alt?: string;
};

type CreateMdxComponentsArgs = {
  /** これと一致した画像だけ priority 付与 */
  priorityImageSrc?: string | null;
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

const ctaButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '8px',
  padding: '12px 24px',
  backgroundColor: '#38A169',
  color: '#ffffff',
  borderRadius: '8px',
  fontWeight: 'bold',
  textDecoration: 'none',
};

const isCtaLink = (children: React.ReactNode): boolean => {
  const text =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
        ? children.join('')
        : '';
  return text.trimEnd().endsWith('→');
};

const createAnchorLink = (): ((props: MarkdownAnchorProps) => JSX.Element) => {
  const AnchorLink = ({
    href,
    rel,
    target,
    ...restProps
  }: MarkdownAnchorProps): JSX.Element => {
    if (!href) return <a {...restProps} />;

    const isCta = isCtaLink(restProps.children);
    const style = isCta ? ctaButtonStyle : undefined;

    if (isExternalHttpUrl(href)) {
      const safeRel = mergeRelForExternalLink(rel);
      const safeTarget = target ?? '_blank';

      return (
        <a
          {...restProps}
          href={href}
          target={safeTarget}
          rel={safeRel}
          style={style}
        />
      );
    }

    return <a {...restProps} href={href} target={target} rel={rel} style={style} />;
  };

  return AnchorLink;
};

const createMarkdownImage = (
  priorityImageSrc?: string | null
): ((props: MarkdownImageProps) => JSX.Element) => {
  const MarkdownImage = ({
    src,
    alt,
    style,
  }: MarkdownImageProps): JSX.Element => {
    if (!src || src.trim().length === 0) return <></>;

    const isRemoteImage =
      src.startsWith('http://') || src.startsWith('https://');
    const shouldPrioritize = Boolean(
      priorityImageSrc && src === priorityImageSrc
    );

    const wrapperStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      display: 'block',
      margin: '24px 0',
      borderRadius: 12,
      overflow: 'hidden',
      paddingTop: '56.25%', // 16:9
      ...style,
    };

    const innerStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
    };

    return (
      <span style={wrapperStyle}>
        <span style={innerStyle}>
          <Image
            src={src}
            alt={alt ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, 900px'
            style={{ objectFit: 'contain' }}
            unoptimized={isRemoteImage}
            priority={shouldPrioritize}
          />
        </span>
      </span>
    );
  };

  return MarkdownImage;
};

export const createMdxComponents = ({
  priorityImageSrc,
}: CreateMdxComponentsArgs) => {
  return {
    a: createAnchorLink(),
    img: createMarkdownImage(priorityImageSrc),
  } as const;
};
