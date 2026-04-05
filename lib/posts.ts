import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostMeta = {
    slug: string;
    title: string;
    date: string;         // ISO string e.g. "2026-04-06"
    summary: string;
    tags: string[];
    readingTime: number;  // estimated minutes
};

export type Post = PostMeta & {
    content: string;      // raw MDX string
};

// ---------- helpers ----------

function estimateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function parsePost(filename: string): Post {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
        slug,
        title: data.title ?? "Untitled",
        date: data.date ?? new Date().toISOString().split("T")[0],
        summary: data.summary ?? "",
        tags: data.tags ?? [],
        readingTime: estimateReadingTime(content),
        content,
    };
}

// ---------- public API ----------

/** Returns all posts sorted newest first */
export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(POSTS_DIR)) return [];

    return fs
        .readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map(parsePost)
        .map(({ content: _content, ...meta }) => meta) // strip content for listing
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Returns a single post by slug, or null if not found */
export function getPostBySlug(slug: string): Post | null {
    const filename = `${slug}.mdx`;
    const filePath = path.join(POSTS_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    return parsePost(filename);
}

/** Returns all slugs — used by generateStaticParams */
export function getAllSlugs(): string[] {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs
        .readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""));
}