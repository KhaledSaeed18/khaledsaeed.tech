import { Github, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black text-white">
      <div className="text-center space-y-8 relative z-10">
        {/* Name */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            Khaled Saeed
          </h1>
          <div className="h-1 w-16 bg-white mx-auto rounded-full" />
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <p className="font-mono text-green-400/50 text-sm sm:text-base">
            <span className="text-green-500/50">$</span> building --portfolio{" "}
            <span className="inline-block w-2 h-5 bg-green-400 align-middle animate-pulse animation-duration-[0.6s]" />
          </p>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Crafting something new. Check back soon.
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="https://github.com/KhaledSaeed18"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/50 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Github className="size-5 text-white/60 group-hover:text-white transition-colors" />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              GitHub
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/khaled-s-saeed/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/50 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Linkedin className="size-5 text-white/60 group-hover:text-white transition-colors" />
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              LinkedIn
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
