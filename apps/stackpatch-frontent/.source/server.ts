// @ts-nocheck
import * as __fd_glob_7 from "../content/docs/cli/commands.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/project-structure.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/guides.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/faq.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/contribution.mdx?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/cli/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "cli/meta.json": __fd_glob_1, }, {"contribution.mdx": __fd_glob_2, "faq.mdx": __fd_glob_3, "guides.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, "project-structure.mdx": __fd_glob_6, "cli/commands.mdx": __fd_glob_7, });