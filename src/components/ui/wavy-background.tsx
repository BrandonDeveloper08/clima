import React from "react";

type WavyBackgroundProps = {
  colors?: string[]; // Tailwind or CSS color values
  backgroundFill?: string; // CSS color value
  blur?: number; // px
  speed?: number; // base speed factor, higher is faster
  waveWidth?: number; // px height of each wave
  waveOpacity?: number; // 0..1
  className?: string;
  children?: React.ReactNode;
};

// Simple utility to build a linear gradient string from color array
function toLinearGradient(colors: string[]): string {
  if (!colors.length) return "linear-gradient(180deg, #e0f2fe, #bfdbfe 40%, #93c5fd)";
  const stops = colors.join(", ");
  return `linear-gradient(180deg, ${stops})`;
}

export function WavyBackground({
  colors = ["#e0f2fe", "#cbe7ff", "#b3dafe"], // light sky → light blue
  backgroundFill = "#ebf5ff",
  blur = 10,
  speed = 1,
  waveWidth = 120,
  waveOpacity = 0.5,
  className,
  children,
}: WavyBackgroundProps) {
  const gradient = toLinearGradient(colors);

  // Three layers with different speeds to create parallax depth
  const baseDur = 24 / Math.max(0.1, speed); // seconds

  return (
    <div className={"relative w-full h-full overflow-hidden " + (className ?? "")}
      style={{ background: gradient }}
    >
      {/* Solid fill below gradient to ensure pleasant base color */}
      <div className="absolute inset-0" style={{ background: backgroundFill, opacity: 0.35 }} />

      {/* Waves container */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ filter: `blur(${blur}px)` }}>
        {/* Wave layer 1 */}
        <svg className="absolute inset-x-0 bottom-0 w-[200%] h-[${waveWidth}px] translate-x-0 animate-wave-1" viewBox="0 0 1440 200" preserveAspectRatio="none"
             style={{ height: waveWidth, opacity: waveOpacity, animationDuration: `${baseDur}s` }}>
          <path fill="url(#grad1)" d="M0,96L60,101.3C120,107,240,117,360,128C480,139,600,149,720,154.7C840,160,960,160,1080,149.3C1200,139,1320,117,1380,106.7L1440,96L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
          <defs>
            <linearGradient id="grad1" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#cfe8ff" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave layer 2 */}
        <svg className="absolute inset-x-0 bottom-0 w-[200%] animate-wave-2" viewBox="0 0 1440 200" preserveAspectRatio="none"
             style={{ height: waveWidth, opacity: Math.min(1, waveOpacity * 0.85), animationDuration: `${baseDur * 1.4}s` }}>
          <path fill="url(#grad2)" d="M0,64L80,69.3C160,75,320,85,480,106.7C640,128,800,160,960,160C1120,160,1280,128,1360,112L1440,96L1440,200L1360,200C1280,200,1120,200,960,200C800,200,640,200,480,200C320,200,160,200,80,200L0,200Z" />
          <defs>
            <linearGradient id="grad2" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave layer 3 */}
        <svg className="absolute inset-x-0 bottom-0 w-[200%] animate-wave-3" viewBox="0 0 1440 200" preserveAspectRatio="none"
             style={{ height: waveWidth, opacity: Math.min(1, waveOpacity * 0.7), animationDuration: `${baseDur * 1.9}s` }}>
          <path fill="url(#grad3)" d="M0,128L48,122.7C96,117,192,107,288,101.3C384,96,480,96,576,117.3C672,139,768,181,864,202.7C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z" />
          <defs>
            <linearGradient id="grad3" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}


