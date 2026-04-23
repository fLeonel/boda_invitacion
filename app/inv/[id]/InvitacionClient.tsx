"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Heart, Send, Sparkles, Church, PartyPopper, ExternalLink, Pause, Play, Mail } from "lucide-react";

type Invitado = {
  nombre: string;
  apellido?: string;
  invitados: number;
};

type FloatingHeart = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  top: number;
};

function getDeterministicValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

// Floating hearts component - reduced amount
const HEARTS_DATA: FloatingHeart[] = [...Array(8)].map((_, i) => ({
  id: i,
  left: 10 + (i * 12),
  delay: i * 1.5,
  duration: 12 + getDeterministicValue(i + 1) * 6,
  size: 10 + getDeterministicValue(i + 11) * 8,
  opacity: 0.08 + getDeterministicValue(i + 21) * 0.12,
  top: 20 + getDeterministicValue(i + 31) * 60,
}));

const SONG_SRC = "/Que%20Te%20Quiero.mp3";

function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {HEARTS_DATA.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-gentle"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          <Heart
            className="fill-rose-300 text-rose-300"
            style={{
              width: `${heart.size}px`,
              height: `${heart.size}px`,
            }}
          />
        </div>
      ))}
      {/* Sparkles - reduced */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-twinkle"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + i * 15}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          <Sparkles className="h-3 w-3 text-amber-300" style={{ opacity: 0.2 }} />
        </div>
      ))}
    </div>
  );
}

export default function InvitacionClient({ invitado }: { invitado: Invitado }) {
  const [scrollY, setScrollY] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.45;

    const syncPlaybackState = () => {
      setIsAudioPlaying(!audio.paused);
    };

    const tryStartPlayback = async () => {
      try {
        await audio.play();
        setShowAudioPrompt(false);
        syncPlaybackState();
      } catch {
        setShowAudioPrompt(true);
      }
    };

    const handleFirstInteraction = () => {
      void tryStartPlayback();
    };

    audio.addEventListener("play", syncPlaybackState);
    audio.addEventListener("pause", syncPlaybackState);

    void tryStartPlayback();
    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      audio.removeEventListener("play", syncPlaybackState);
      audio.removeEventListener("pause", syncPlaybackState);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const handleAudioToggle = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setShowAudioPrompt(false);
      } catch {
        setShowAudioPrompt(true);
      }
      return;
    }

    audio.pause();
    setShowAudioPrompt(false);
  };

  const mensaje = encodeURIComponent(
    `Hola, soy ${invitado.nombre} ${invitado.apellido ?? ""}. Confirmo mi asistencia a la boda.`
  );

  return (
    <main ref={containerRef} className="relative min-h-screen bg-linear-to-br from-rose-50 via-white to-amber-50 overflow-x-hidden">
      <audio ref={audioRef} src={SONG_SRC} loop preload="auto" />

      {/* Background gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent pointer-events-none" />

      {showAudioPrompt && (
        <div className="fixed inset-x-4 top-4 z-30 rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 text-center shadow-lg shadow-rose-100/50 backdrop-blur-sm md:left-1/2 md:right-auto md:w-104 md:-translate-x-1/2">
          <p className="text-sm text-gray-700">
            Toca cualquier parte de la invitacion o usa el boton de musica para reproducir la cancion.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          void handleAudioToggle();
        }}
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/85 px-4 py-3 text-sm font-medium text-rose-600 shadow-lg shadow-rose-100/50 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5"
        aria-pressed={isAudioPlaying}
        aria-label={isAudioPlaying ? "Pausar musica" : "Reproducir musica"}
      >
        {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isAudioPlaying ? "Pausar musica" : "Reproducir musica"}
      </button>

      {/* Floating hearts */}
      <FloatingHearts />

      {/* HERO FULL con PARALLAX */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {/* Imagen con parallax sutil */}
        <div
          className="absolute inset-0 w-full h-[110%]"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        >
          <Image
            src="/esposos.jpeg"
            alt="Los novios"
            fill
            priority
            className="object-cover scale-105 animate-[scaleDown_2s_ease-out_forwards]"
          />
        </div>

        {/* Overlay con gradiente rosa */}
        <div className="absolute inset-0 bg-linear-to-t from-rose-900/70 via-rose-800/30 to-transparent" />

        {/* Decorative hearts on image - sin parallax extremo */}
        <div className="absolute top-8 left-8 animate-float-gentle">
          <Heart className="h-6 w-6 fill-white/20 text-white/20" />
        </div>
        <div className="absolute top-20 right-10 animate-float-gentle" style={{ animationDelay: "1s" }}>
          <Heart className="h-4 w-4 fill-rose-300/40 text-rose-300/40" />
        </div>

        {/* NOMBRES SOBRE LA IMAGEN */}
        <div className="absolute bottom-16 w-full text-center px-6 animate-[fadeInUp_1s_ease-out_0.5s_both]">
          <p className="text-white text-base tracking-[0.35em] uppercase mb-4 flex items-center justify-center gap-3 font-medium drop-shadow-lg">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-white/60" />
            <Heart className="h-4 w-4 fill-rose-300 text-rose-300 animate-pulse" />
            Nuestra Boda
            <Heart className="h-4 w-4 fill-rose-300 text-rose-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <span className="h-px w-10 bg-linear-to-l from-transparent to-white/60" />
          </p>
          <h1 className="text-white text-4xl md:text-5xl leading-tight font-serif italic drop-shadow-lg">
            Donald Adolfo
            <span className="flex items-center justify-center gap-3 text-2xl md:text-3xl my-4 text-rose-300 not-italic">
              <Heart className="h-4 w-4 fill-rose-300 animate-heartbeat" />
              &amp;
              <Heart className="h-4 w-4 fill-rose-300 animate-heartbeat" style={{ animationDelay: "0.2s" }} />
            </span>
            Gladys Karizhanda
          </h1>

          {/* Fecha destacada */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
            <Calendar className="h-4 w-4 text-rose-200" />
            <span className="text-white/90 tracking-wider">2 de Mayo</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="relative z-10 px-6 py-14 text-center max-w-lg mx-auto">
        {/* Ornamento decorativo con corazones */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-[fadeIn_1s_ease-out_0.8s_both]">
          <div className="w-12 h-px bg-linear-to-r from-transparent to-rose-400" />
          <Heart className="w-3 h-3 text-rose-300 fill-rose-300 animate-pulse" />
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-heartbeat" />
          <Heart className="w-3 h-3 text-rose-300 fill-rose-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="w-12 h-px bg-linear-to-l from-transparent to-rose-400" />
        </div>

        {/* Texto */}
        <p className="text-gray-600 leading-relaxed text-lg font-light animate-[fadeIn_1s_ease-out_1s_both]">
          Con la bendicion de Dios y el amor que nos une, queremos invitarte a
          compartir con nosotros este dia tan especial en el que unimos nuestras
          vidas.
        </p>

        {/* Invitado */}
        <div className="mt-8 animate-[fadeIn_1s_ease-out_1.2s_both]">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400 mb-2">
            Estimado/a
          </p>
          <p className="text-2xl font-serif text-gray-800 italic">
            {invitado.nombre} {invitado.apellido}
          </p>
        </div>

        {/* Separador con corazones */}
        <div className="my-10 flex items-center justify-center gap-4 animate-[fadeIn_1s_ease-out_1.3s_both]">
          <div className="w-16 h-px bg-linear-to-r from-transparent to-rose-300" />
          <Heart className="w-3 h-3 rotate-45 text-rose-400 fill-rose-400 animate-bounce-slow" />
          <div className="w-16 h-px bg-linear-to-l from-transparent to-rose-300" />
        </div>

        {/* CEREMONIA RELIGIOSA */}
        <div className="mb-10 animate-[fadeIn_1s_ease-out_1.4s_both]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Church className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-serif text-gray-800 tracking-wide">Ceremonia Religiosa</h2>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/30 p-6 space-y-4 relative overflow-hidden">
            <Heart className="absolute -right-3 -top-3 h-10 w-10 rotate-12 fill-rose-50 text-rose-50" />

            <div className="flex items-center justify-center gap-3 group">
              <div className="p-2 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors">
                <MapPin className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-gray-700 font-medium">Parroquia San Miguel Arcangel</p>
            </div>

            <div className="flex items-center justify-center gap-3 group">
              <div className="p-2 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors">
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-gray-600">5:00 PM</p>
            </div>

            {/* Boton ver ubicacion */}
            <a
              href="https://maps.app.goo.gl/ZzjRFWq6Pds1MKKU6?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md group"
            >
              <MapPin className="w-4 h-4" />
              Ver ubicacion
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Separador */}
        <div className="my-8 flex items-center justify-center gap-3">
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300" />
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse" />
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300" />
        </div>

        {/* RECEPCION */}
        <div className="mb-10 animate-[fadeIn_1s_ease-out_1.5s_both]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-serif text-gray-800 tracking-wide">Recepcion</h2>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-lg shadow-amber-100/30 p-6 space-y-4 relative overflow-hidden">
            <Sparkles className="absolute -left-2 -top-2 h-8 w-8 text-amber-100" />

            <div className="flex items-center justify-center gap-3 group">
              <div className="p-2 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-gray-700 font-medium">Lote 24 Manzana C</p>
                <p className="text-gray-500 text-sm">Residenciales San Miguel, Zona 10</p>
                <p className="text-gray-500 text-sm">San Miguel Petapa</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 group">
              <div className="p-2 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-gray-600">6:30 PM</p>
            </div>

            {/* Boton ver ubicacion */}
            <a
              href="https://maps.app.goo.gl/pCAUdrzZXMzXRLSj8"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md group"
            >
              <MapPin className="w-4 h-4" />
              Ver ubicacion
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Pase */}
        <div className="mt-12 py-8 px-6 bg-linear-to-br from-white/80 to-rose-50/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-xl shadow-rose-100/40 animate-[fadeIn_1s_ease-out_1.6s_both] relative overflow-hidden">
          {/* Corner hearts */}
          <Heart className="absolute -right-2 -top-2 h-10 w-10 rotate-12 fill-rose-100 text-rose-100" />
          <Heart className="absolute -bottom-2 -left-2 h-8 w-8 -rotate-12 fill-amber-100 text-amber-100" />
          <Heart className="absolute top-1/2 -right-4 h-6 w-6 fill-rose-50 text-rose-50 animate-pulse" />

          <p className="text-xs uppercase tracking-[0.2em] text-rose-400 mb-2">
            Pase valido para
          </p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300 animate-heartbeat" />
            <span className="text-5xl font-serif text-rose-500">
              {invitado.invitados}
            </span>
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300 animate-heartbeat" style={{ animationDelay: "0.3s" }} />
          </div>
          <span className="text-gray-500 text-sm">
            {invitado.invitados === 1 ? "persona" : "personas"}
          </span>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-100 bg-linear-to-br from-amber-50/90 via-white to-rose-50/90 px-6 py-7 text-center shadow-lg shadow-amber-100/40 animate-[fadeIn_1s_ease-out_1.65s_both] relative overflow-hidden">
          <Sparkles className="absolute -top-2 left-5 h-6 w-6 text-amber-200" />
          <Heart className="absolute -bottom-2 right-5 h-8 w-8 fill-rose-100 text-rose-100" />

          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md shadow-amber-100/60">
            <Mail className="h-5 w-5 text-amber-500" />
          </div>

          <p className="text-xs uppercase tracking-[0.28em] text-amber-500 mb-3">
            Lluvia de sobres
          </p>
          <p className="font-serif text-2xl italic text-gray-800">
            Tu presencia es nuestro mejor regalo
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Si deseas acompañarnos con un detalle, sera recibido con mucho carino,
            ya sea en regalo o en efectivo. Pero, sobre todo, lo que mas atesoramos
            es compartir este dia contigo.
          </p>
        </div>

        {/* Boton */}
        <a
          href={`https://wa.me/50244718560?text=${mensaje}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 flex items-center justify-center gap-3 bg-linear-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white py-4 px-8 rounded-full shadow-lg shadow-rose-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-400/40 hover:-translate-y-1 animate-[fadeIn_1s_ease-out_1.7s_both] relative overflow-hidden"
        >
          <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-medium tracking-wide">Confirmar asistencia</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </a>

        {/* Footer decorativo con corazones */}
        <div className="mt-14 flex items-center justify-center gap-2 animate-[fadeIn_1s_ease-out_1.8s_both]">
          <div className="w-8 h-px bg-rose-200" />
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300 animate-pulse" />
          <Heart className="w-2 h-2 fill-amber-300 text-amber-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-heartbeat" />
          <Heart className="w-2 h-2 fill-amber-300 text-amber-300 animate-pulse" style={{ animationDelay: "0.4s" }} />
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300 animate-pulse" style={{ animationDelay: "0.6s" }} />
          <div className="w-8 h-px bg-rose-200" />
        </div>

        <p className="mt-4 text-xs tracking-widest text-gray-400 flex items-center justify-center gap-2">
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300" />
          Con amor, los novios
          <Heart className="w-2 h-2 fill-rose-300 text-rose-300" />
        </p>
      </section>

      {/* Estilos de animacion */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleDown {
          from {
            transform: scale(1.15);
          }
          to {
            transform: scale(1.1);
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float-sway {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(15px) translateY(-10px) rotate(10deg);
          }
          50% {
            transform: translateX(0) translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translateX(-15px) translateY(-10px) rotate(-10deg);
          }
        }
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes float-diagonal {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -20px) rotate(90deg);
          }
          50% {
            transform: translate(0, -40px) rotate(180deg);
          }
          75% {
            transform: translate(-20px, -20px) rotate(270deg);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.3);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(1);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-6px) rotate(45deg);
          }
        }
        .animate-float-up {
          animation: float-up 14s ease-in-out infinite;
        }
        .animate-float-sway {
          animation: float-sway 6s ease-in-out infinite;
        }
        .animate-float-gentle {
          animation: float-gentle 5s ease-in-out infinite;
        }
        .animate-float-diagonal {
          animation: float-diagonal 8s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}