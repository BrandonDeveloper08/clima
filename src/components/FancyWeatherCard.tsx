import React from "react";

type FancyWeatherCardProps = {
  title: string; // e.g., "TEMPERATURA"
  value: string; // e.g., "23°"
  icon?: React.ReactNode; // right-side visual
};

export default function FancyWeatherCard({ title, value, icon }: FancyWeatherCardProps) {
  return (
    <div className="relative w-[350px] h-[180px] p-6 rounded-2xl bg-white shadow-[0_155px_62px_rgba(0,0,0,0.01),0_87px_52px_rgba(0,0,0,0.05),0_39px_39px_rgba(0,0,0,0.09),0_10px_21px_rgba(0,0,0,0.10)] transition-transform duration-700 ease-out hover:scale-[1.03] overflow-hidden"
      style={{ backgroundImage: "radial-gradient(178.94% 106.41% at 26.42% 106.41%, rgba(224,242,254,0.9) 0%, rgba(255,255,255,0) 71.88%)" }}
    >
      {/* Top-left title */}
      <div className="absolute left-6 top-5">
        <span className="font-extrabold text-[15px] leading-[135%] text-[color:rgba(30,58,138,0.80)]">
          {title}
        </span>
      </div>

      {/* Bottom-left value */}
      <span className="absolute left-6 bottom-4 font-bold text-[48px] leading-[1] text-[color:rgba(15,23,42,0.95)]">
        {value}
      </span>

      {/* Right-side image/icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {icon ?? (
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 fwc-cloud fwc-front" />
            <div className="absolute inset-0 fwc-cloud fwc-back" />
          </div>
        )}
      </div>
    </div>
  );
}