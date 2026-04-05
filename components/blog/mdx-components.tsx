import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Custom renderers passed to next-mdx-remote.
 * Override any HTML element that MDX produces.
 */
export const mdxComponents: MDXComponents = {
    // Headings with anchor links (rehype-slug adds the id)
    h1: ({ children, id }) => (
        <h1 id={id} className="group mt-10 mb-4 text-2xl font-bold scroll-mt-20">
            {children}
            {id && <AnchorLink id={id} />}
        </h1>
    ),
    h2: ({ children, id }) => (
        <h2 id={id} className="group mt-8 mb-3 text-xl font-semibold scroll-mt-20">
            {children}
            {id && <AnchorLink id={id} />}
        </h2>
    ),
    h3: ({ children, id }) => (
        <h3 id={id} className="group mt-6 mb-2 text-lg font-semibold scroll-mt-20">
            {children}
            {id && <AnchorLink id={id} />}
        </h3>
    ),

    // Paragraphs
    p: ({ children }) => (
        <p className="mb-5 leading-7 text-muted-foreground">{children}</p>
    ),

    // Inline code (NOT code blocks — those are handled by rehype-pretty-code)
    code: ({ children }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
            {children}
        </code>
    ),

    // Code blocks wrapper (rehype-pretty-code targets the <pre> element)
    pre: ({ children, ...props }) => (
        <div className="relative my-6">
            <pre
                {...props}
                className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed"
            >
                {children}
            </pre>
        </div>
    ),

    // Blockquote
    blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-2 border-primary pl-4 italic text-muted-foreground">
            {children}
        </blockquote>
    ),

    // Links — internal links use Next <Link>, external open in new tab
    a: ({ href = "", children }) => {
        const isInternal = href.startsWith("/") || href.startsWith("#");
        if (isInternal) {
            return (
                <Link href={href} className="text-primary underline underline-offset-4 hover:opacity-80">
                    {children}
                </Link>
            );
        }
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80"
            >
                {children}
            </a>
        );
    },

    // Lists
    ul: ({ children }) => (
        <ul className="mb-5 ml-6 list-disc space-y-1 text-muted-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="mb-5 ml-6 list-decimal space-y-1 text-muted-foreground">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,

    // Horizontal rule
    hr: () => <hr className="my-8 border-border" />,

    // Images
    img: ({ src, alt }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt ?? ""}
            className="my-6 w-full rounded-lg border border-border"
        />
    ),

    // Tables (remark-gfm)
    table: ({ children }) => (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-border px-4 py-2 text-muted-foreground">{children}</td>
    ),
};

// Small anchor icon that appears on hover next to headings
function AnchorLink({ id }: { id: string }) {
    return (
        <a
            href={`#${id}`}
            className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-muted-foreground no-underline"
            aria-hidden="true"
        >
            #
        </a>
    );
}