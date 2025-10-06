"use client"

export function WeatherBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-300 via-sky-400 to-sky-200">
      {/* Nubes flotantes */}
      <div className="absolute top-10 left-[-10%] w-64 h-32 bg-white/40 rounded-full blur-xl animate-float-slow" />
      <div className="absolute top-32 right-[-5%] w-80 h-40 bg-white/30 rounded-full blur-xl animate-float-medium" />
      <div className="absolute top-64 left-[20%] w-56 h-28 bg-white/50 rounded-full blur-xl animate-float-fast" />
      <div className="absolute top-96 right-[30%] w-72 h-36 bg-white/35 rounded-full blur-xl animate-float-slow delay-1000" />

      {/* Líneas de viento */}
      <div className="absolute top-[20%] left-0 w-full h-1 opacity-20">
        <div className="absolute w-32 h-0.5 bg-white rounded-full animate-wind-1" />
      </div>
      <div className="absolute top-[40%] left-0 w-full h-1 opacity-15">
        <div className="absolute w-24 h-0.5 bg-white rounded-full animate-wind-2" />
      </div>
      <div className="absolute top-[60%] left-0 w-full h-1 opacity-20">
        <div className="absolute w-40 h-0.5 bg-white rounded-full animate-wind-3" />
      </div>
      <div className="absolute top-[80%] left-0 w-full h-1 opacity-10">
        <div className="absolute w-28 h-0.5 bg-white rounded-full animate-wind-1" />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-white/60 rounded-full animate-particle-1" />
      <div className="absolute top-[35%] left-[70%] w-1.5 h-1.5 bg-white/50 rounded-full animate-particle-2" />
      <div className="absolute top-[55%] left-[30%] w-2.5 h-2.5 bg-white/40 rounded-full animate-particle-3" />
      <div className="absolute top-[75%] left-[80%] w-1 h-1 bg-white/70 rounded-full animate-particle-1" />
      <div className="absolute top-[25%] left-[50%] w-1.5 h-1.5 bg-white/55 rounded-full animate-particle-2" />
    </div>
  )
}