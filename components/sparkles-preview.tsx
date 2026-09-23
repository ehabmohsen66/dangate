"use client";

import { SparklesCore } from "@/components/ui/sparkles";

export function SparklesPreview() {
  return (
    <div className="relative mt-4 mb-2 flex h-24 w-full flex-col items-center justify-start overflow-hidden">
      {/* Centered glowing gradient lines and floating sparkles */}
      <div className="relative h-24 w-full max-w-[36rem]">
        {/* Aceternity original orange/glow gradients */}
        <div className="absolute inset-x-[12%] top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-[#ff5a1f] to-transparent blur-sm" />
        <div className="absolute inset-x-[12%] top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-[#ff5a1f] to-transparent" />

        {/* Aceternity original sky-500 central accent gradient */}
        <div className="absolute inset-x-[38%] top-0 h-[4px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
        <div className="absolute inset-x-[38%] top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

        {/* Floating sparkles with original demo colors */}
        <div className="h-full w-full [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_75%)]">
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.8}
            particleDensity={400}
            className="h-full w-full"
            particleColor={["#ff5a1f", "#0ea5e9", "#f15a22", "#38bdf8", "#332f3f"]}
          />
        </div>
      </div>
    </div>
  );
}

export default SparklesPreview;
