// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"contribution.mdx": () => import("../content/docs/contribution.mdx?collection=docs"), "faq.mdx": () => import("../content/docs/faq.mdx?collection=docs"), "guides.mdx": () => import("../content/docs/guides.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "project-structure.mdx": () => import("../content/docs/project-structure.mdx?collection=docs"), "cli/commands.mdx": () => import("../content/docs/cli/commands.mdx?collection=docs"), }),
};
export default browserCollections;