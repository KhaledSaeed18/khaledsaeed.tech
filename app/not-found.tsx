import Link from "next/link";
import { ArrowLeft, TerminalSquare } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-dvh bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.12),transparent_30%)]" />

            <section className="relative z-10 w-full max-w-xl text-center space-y-8">
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 bg-white/5 px-4 py-2">
                    <TerminalSquare className="size-4 text-green-400/80" />
                    <span className="font-mono text-xs sm:text-sm text-green-300/80">
                        error --route-not-found
                    </span>
                </div>

                <div className="space-y-3">
                    <p className="font-mono text-green-500/70 text-sm sm:text-base">404</p>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Page Not Found</h1>
                    <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
                        This link drifted into the void. Let&apos;s get you back to the main page.
                    </p>
                </div>

                <div className="h-px w-28 bg-green-500/40 mx-auto" />

                <Link
                    href="/"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-green-500/50 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="size-4 text-white/70 group-hover:text-white transition-colors" />
                    <span className="text-sm sm:text-base text-white/80 group-hover:text-white transition-colors">
                        Back to Home
                    </span>
                </Link>
            </section>
        </main>
    );
}
