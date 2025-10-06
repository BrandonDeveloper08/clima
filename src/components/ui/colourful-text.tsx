import React from "react";

type ColourfulTextProps = {
  text: string;
  className?: string;
};

export default function ColourfulText({ text, className }: ColourfulTextProps) {
  return (
    <span
      className={
        "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.35)] " +
        (className ?? "")
      }
    >
      {text}
    </span>
  );
}