import Image, { ImageProps } from 'next/image';
import Link from 'next/link';

const MdxImage = (props: ImageProps): JSX.Element => (
  <figure style={{ margin: '24px 0' }}>
    <Image {...props} alt={props.alt ?? ''} />
    {props.alt ? (
      <figcaption style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        {props.alt}
      </figcaption>
    ) : null}
  </figure>
);

export const Mdx = {
  a: (props: any) => {
    const href = props.href as string | undefined;
    const isExternal = href?.startsWith('http');

    if (isExternal)
      return <a {...props} target='_blank' rel='noreferrer noopener' />;

    return <Link href={href ?? '#'} {...props} />;
  },
  Image: MdxImage,
};
