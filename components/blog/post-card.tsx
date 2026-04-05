import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
    const formatted = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <article className="rounded-lg border border-border p-6 transition-colors hover:bg-muted/50">
                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
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

                {/* Title */}
                <h2 className="mb-2 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                </h2>

                {/* Summary */}
                {post.summary && (
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {post.summary}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{formatted}</time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                </div>
            </article>
        </Link>
    );
}