import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
    title: "Blog — Khaled Saeed",
    description:
        "Technical writing on backend architecture, system design, cybersecurity, and software engineering.",
    openGraph: {
        title: "Blog — Khaled Saeed",
        description:
            "Technical writing on backend architecture, system design, cybersecurity, and software engineering.",
        url: "https://khaledsaeed.tech/blog",
    },
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main className="mx-auto max-w-2xl px-4 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="mb-3 text-3xl font-bold">Blog</h1>
                <p className="text-muted-foreground">
                    Technical writing on backend architecture, system design, cybersecurity, and
                    things I build or learn.
                </p>
            </div>

            {/* Post list */}
            {posts.length === 0 ? (
                <p className="text-muted-foreground">No posts yet. Check back soon.</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            )}
        </main>
    );
}