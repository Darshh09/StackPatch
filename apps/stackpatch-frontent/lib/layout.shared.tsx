import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { Github } from 'lucide-react';
import { Logo } from '@/components/logo';

export const logo = <Logo size={32} />;

export const links: LinkItemType[] = [
  {
    text: 'Docs',
    url: '/docs',
    active: 'nested-url',
  },
  {
    text: 'NPM',
    icon: (
      <svg
        className="size-4 invert-0 "
        fill="#fff"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
      </svg>
    ),
    label: 'NPM',
    type: 'icon',
    url: 'https://www.npmjs.com/package/stackpatch',
    external: true,
    secondary: true,
  },
  {
    text: 'X',
    icon: (
      <svg
        className="size-4 invert dark:invert-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: 'X',
    type: 'icon',
    url: 'https://twitter.com/Darshhh1800',
    external: true,
    secondary: true,
  },

];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium font-mono text-md tracking-tighter">StackPatch</span>
        </>
      ),
    },
    links: links,
    githubUrl: 'https://github.com/Darshh09/StackPatch',
  };
}
