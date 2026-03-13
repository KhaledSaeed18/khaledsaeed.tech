import {
  ExternalLink,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import FaultyTerminal from "@/components/FaultyTerminal";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <FaultyTerminal
          scale={3}
          mobileScale={1}
          gridMul={[1.8, 1]}
          digitSize={2.2}
          timeScale={1.15}
          pause={false}
          scanlineIntensity={0.42}
          glitchAmount={2}
          flickerAmount={0.7}
          noiseAmp={0.72}
          chromaticAberration={0}
          dither={0}
          curvature={0.25}
          tint="#9CEB97"
          mouseReact={false}
          mouseStrength={0}
          pageLoadAnimation={true}
          brightness={0.92}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 z-1 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0.70),rgba(0,0,0,0.54)_45%,rgba(0,0,0,0.76)),radial-gradient(circle_at_20%_15%,rgba(35,197,94,0.10),transparent_40%),radial-gradient(circle_at_80%_78%,rgba(35,197,94,0.08),transparent_35%)]" />
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
          <p className="font-mono text-green-400 text-sm sm:text-base">
            <span className="text-green-500">$</span> building --portfolio{" "}
            <span className="inline-block w-2 h-5 bg-green-400 align-middle animate-pulse animation-duration-[0.6s]" />
          </p>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Crafting something new. Check back soon.
          </p>
        </div>

        {/* Social links */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2 w-full max-w-md mx-auto">
          <a
            href="https://github.com/KhaledSaeed18"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <Github className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              GitHub
            </span>
            <ExternalLink className="absolute right-4 size-5 text-green-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out" />
          </a>
          <a
            href="https://www.linkedin.com/in/khaled-s-saeed/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <Linkedin className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              LinkedIn
            </span>
            <ExternalLink className="absolute right-4 size-5 text-green-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out" />
          </a>
          <a
            href="https://www.instagram.com/khaledd.saeed"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <Instagram className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              Instagram
            </span>
            <ExternalLink className="absolute right-4 size-5 text-green-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out" />
          </a>
          <a
            href="https://x.com/KhaleddSaeed18"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <Twitter className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              X
            </span>
            <ExternalLink className="absolute right-4 size-5 text-green-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out" />
          </a>
          <a
            href="https://dev.to/khaledsaeed18"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <FileText className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              Dev.to
            </span>
            <ExternalLink className="absolute right-4 size-5 text-green-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out" />
          </a>
          <div className="h-px w-24 bg-green-500/30" />
          <a
            href="mailto:khaled18saeed@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Khaled%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out%20about%20%5Btopic%5D.%0A%0ADetails%3A%0A%5Bwrite%20your%20message%20here%5D%0A%0AThanks%2C%0A%5Byour%20name%5D"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 px-5 py-3 rounded-lg border border-green-500/50 bg-black/80 hover:bg-white/10 transition-colors duration-300 ease-out w-full"
          >
            <Mail className="size-5 text-white/60 group-hover:text-white transition-colors duration-300 ease-out" />
            <span className="text-sm sm:text-base text-white/60 group-hover:text-white transition-colors duration-300 ease-out">
              Send Me an Email
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
