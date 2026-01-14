import type { Metadata } from "next";

import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";

import {  source } from "@/lib/source";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ style: "clerk" }} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, ...TabsComponents, ...FilesComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = source.getPage(slug);
  if (!page) notFound();


  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",

    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,

    },
  };
}
