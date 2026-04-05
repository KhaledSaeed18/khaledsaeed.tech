import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/blog/mdx-components";

// ---------- Static generation ----------

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

// ---------- Metadata ----------

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};

    return {
        title: `${post.title} — Khaled Saeed`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            url: `https://khaledsaeed.tech/blog/${post.slug}`,
            type: "article",
            publishedTime: post.date,
            tags: post.tags,
        },
    };
}

// ---------- Page ----------

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const formatted = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="mx-auto max-w-2xl px-4 py-16">
            {/* Back link */}
            <Link
                href="/blog"
                className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                ← All posts
            </Link>

            {/* Post header */}
            <header className="mb-10">
                {post.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className="mb-4 text-3xl font-bold leading-tight">{post.title}</h1>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={post.date}>{formatted}</time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                </div>
            </header>

            {/* MDX content */}
            <article className="prose-custom">
                <MDXRemote
                    source={post.content}
                    components={mdxComponents}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [
                                rehypeSlug,
                                [
                                    rehypePrettyCode,
                                    {
                                        // https://shiki.style/themes
                                        theme: "github-dark",
                                        keepBackground: false, // let Tailwind control the bg
                                    },
                                ],
                            ],
                        },
                    }}
                />
            </article>
        </main>
    );
}