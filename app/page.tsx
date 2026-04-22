"use client";

import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { invitados } from "@/lib/invitados";
import { Sparkles, Heart, Search, ArrowRight } from "lucide-react";

type ModelViewerProps = HTMLAttributes<HTMLElement> & {
  src?: string;
  "auto-rotate"?: boolean;
  "camera-controls"?: boolean;
  "disable-zoom"?: boolean;
  exposure?: string;
  "shadow-intensity"?: string;
  "environment-image"?: string;
};
const ModelViewer = "model-viewer" as unknown as React.FC<ModelViewerProps>;

const normalizar = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

type Particle = { id: number; left: number; top: number; delay: number; duration: number };

// PRNG con semilla fija — mismos valores en servidor y cliente
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const PARTICLES_DATA: Particle[] = (() => {
  const rand = seededRandom(42);
  return [...Array(20)].map((_, i) => ({
    id: i,
    left: rand() * 100,
    top: rand() * 100,
    delay: rand() * 5,
    duration: 6 + rand() * 4,
  }));
})();

// Floating particles component
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES_DATA.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float opacity-20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.id % 3 === 0 ? (
            <Heart className="h-3 w-3 fill-rose-300 text-rose-300" />
          ) : p.id % 3 === 1 ? (
            <Sparkles className="h-3 w-3 text-amber-300" />
          ) : (
            <span className="text-xs text-rose-200">&#10022;</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import("@google/model-viewer");
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const texto = normalizar(input);

    const invitado = invitados.find((i) => {
      const full = normalizar(`${i.nombre} ${i.apellido || ""}`);
      return full === texto;
    });

    if (invitado) {
      router.push(`/inv/${invitado.id}`);
    } else {
      setError("No encontramos tu nombre en la lista. Revisa que esté bien escrito.");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent" />
      <FloatingParticles />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-200/30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-100/20" />

      {/* 3D Model */}
      <div
        className={`relative z-10 transition-all duration-1000 ease-out ${isLoaded ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
      >
        <ModelViewer
          src="/3dring.glb"
          auto-rotate
          camera-controls
          disable-zoom
          exposure="1.3"
          shadow-intensity="1"
          environment-image="neutral"
          className="h-70 w-70 drop-shadow-2xl sm:h-80 sm:w-80"
        />
        {/* Glow effect under the ring */}
        <div className="absolute bottom-4 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-rose-300/30 blur-xl" />
      </div>

      {/* Header */}
      <header
        className={`relative z-10 mt-2 text-center transition-all delay-200 duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
      >
        <p className="mb-2 flex items-center justify-center gap-2 text-sm tracking-[0.3em] text-rose-400">
          <span className="h-px w-8 bg-linear-to-r from-transparent to-rose-300" />
          ESTÁS INVITADO
          <span className="h-px w-8 bg-linear-to-l from-transparent to-rose-300" />
        </p>
        <h1 className="font-serif text-5xl font-light italic tracking-wide text-gray-800 sm:text-6xl">
          Nuestra Boda
        </h1>
        <p className="mt-4 max-w-xs text-balance text-gray-500">
          Nos encantaría que formes parte de este momento tan especial
        </p>
      </header>

      {/* Ornament */}
      <div
        className={`relative z-10 my-8 flex items-center gap-4 transition-all delay-300 duration-1000 ease-out ${isLoaded ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
      >
        <span className="h-px w-12 bg-linear-to-r from-transparent via-rose-300 to-rose-300" />
        <Heart className="h-4 w-4 animate-pulse fill-rose-400 text-rose-400" />
        <span className="h-px w-12 bg-linear-to-l from-transparent via-rose-300 to-rose-300" />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-sm transition-all delay-500 duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
      >
        <div className="rounded-2xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-rose-100/50 backdrop-blur-sm">
          {/* Card decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-linear-to-r from-rose-400 to-amber-400 p-2 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          <p className="mt-2 text-center font-serif text-xl text-gray-800">
            Tu invitación te espera
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Ingresa tu nombre completo para verla
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <div
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? "text-rose-400" : "text-gray-400"
                  }`}
              >
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Nombre y apellido"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full rounded-xl border-2 bg-white/80 py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${isFocused
                  ? "border-rose-300 shadow-lg shadow-rose-100"
                  : "border-gray-200 hover:border-rose-200"
                  } ${error ? "border-red-300 shake" : ""}`}
              />
            </div>

            {error && (
              <p className="animate-fade-in flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                {error}
              </p>
            )}

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-rose-400 to-rose-500 py-4 font-medium text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-300 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Ver mi invitación
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer decoration */}
      <p
        className={`relative z-10 mt-8 text-xs tracking-widest text-gray-400 transition-all delay-700 duration-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        Con amor, los novios
      </p>

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </main>
  );
}
