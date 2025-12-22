"use client";
import { useState, useEffect, useMemo } from 'react';

interface Crystal {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export default function Snow() {
  const [snowmanVisible, setSnowmanVisible] = useState(false);
  const [snowmanReady, setSnowmanReady] = useState(false);
  const [snowmanFading, setSnowmanFading] = useState(false);
  const [crystals, setCrystals] = useState<Crystal[]>(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 5,
      animationDelay: Math.random() * 3,
      size: 15 + Math.random() * 25,
      opacity: 0.5 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: 3 + Math.random() * 5
    }))
  );
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1000,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 4,
      animationDelay: Math.random() * 5,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7
    }))
  );
  const [snowFading, setSnowFading] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  useEffect(() => {

    // Snowman appears in slow motion
    const snowmanTimer = setTimeout(() => {
      setSnowmanVisible(true);
      setSnowmanReady(true);
    }, 500);

    // Start fade out after 8 seconds
    const fadeOutTimer = setTimeout(() => {
      setSnowmanFading(true);
    }, 8500);

    // Remove snowman after fade completes (8s descent + 6s fade out)
    const removeTimer = setTimeout(() => {
      setSnowmanVisible(false);
      setSnowmanReady(false);
    }, 14500);

    // Continuously create new ice crystals
    const crystalInterval = setInterval(() => {
      const newCrystal: Crystal = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 5,
        animationDelay: 0,
        size: 15 + Math.random() * 25,
        opacity: 0.5 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: 3 + Math.random() * 5
      };
      
      setCrystals(prev => {
        const updated = [...prev, newCrystal];
        if (updated.length > 40) {
          return updated.slice(1);
        }
        return updated;
      });
    }, 1000);

    // Continuously create new snowflakes
    const snowInterval = setInterval(() => {
      const newSnowflake: Snowflake = {
        id: Date.now() + Math.random() + 10000,
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 4,
        animationDelay: 0,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7
      };
      
      setSnowflakes(prev => {
        const updated = [...prev, newSnowflake];
        if (updated.length > 150) {
          return updated.slice(1);
        }
        return updated;
      });
    }, 500);

    // Stop snow after 20 seconds
    const stopSnowTimer = setTimeout(() => {
      setSnowFading(true);
      clearInterval(crystalInterval);
      clearInterval(snowInterval);
    }, 20000);

    return () => {
      clearTimeout(snowmanTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
      clearTimeout(stopSnowTimer);
      clearInterval(crystalInterval);
      clearInterval(snowInterval);
    };
  }, []);

  useEffect(() => {
    if (snowFading) {
      const fadeInterval = setInterval(() => {
        setFadeOpacity(prev => {
          const newOpacity = prev - 0.02;
          if (newOpacity <= 0) {
            clearInterval(fadeInterval);
            setCrystals([]);
            setSnowflakes([]);
            return 0;
          }
          return newOpacity;
        });
      }, 100);
      return () => clearInterval(fadeInterval);
    }
  }, [snowFading]);

  // Memoize snowman structure

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Small Snowflakes with crystal design - Background layer */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity * fadeOpacity,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.animationDelay}s`,
            top: '-20px',
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <defs>
              <filter id={`smallGlow-${flake.id}`}>
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter={`url(#smallGlow-${flake.id})`}>
              {/* Simple 4-pointed star */}
              <line x1="10" y1="2" x2="10" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </g>
          </svg>
        </div>
      ))}

      {/* Large Ice Crystals - Foreground layer */}
      {crystals.map(crystal => (
        <div
          key={crystal.id}
          className="absolute"
          style={{
            left: `${crystal.left}%`,
            width: `${crystal.size}px`,
            height: `${crystal.size}px`,
            opacity: crystal.opacity * fadeOpacity,
            animation: `fall ${crystal.animationDuration}s linear infinite`,
            animationDelay: `${crystal.animationDelay}s`,
            top: '-100px',
            willChange: 'transform',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))'
          }}
        >
          <div style={{
            animation: `rotate ${crystal.rotationSpeed}s linear infinite`,
            width: '100%',
            height: '100%'
          }}>
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'brightness(1.8)' }}>
            <defs>
              <radialGradient id={`crystalGrad-${crystal.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#e0f2fe" stopOpacity="1" />
                <stop offset="70%" stopColor="#7dd3fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </radialGradient>
              <filter id={`glow-${crystal.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Main crystal star shape with 6 points */}
            <g filter={`url(#glow-${crystal.id})`}>
              {/* Center hexagon */}
              <polygon 
                points="50,35 60,42.5 60,57.5 50,65 40,57.5 40,42.5" 
                fill={`url(#crystalGrad-${crystal.id})`}
                stroke="#ffffff" 
                strokeWidth="2"
              />
              {/* 6 main spikes */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="50" x2="84" y2="28" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="50" x2="84" y2="72" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="50" x2="16" y2="72" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="50" x2="16" y2="28" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              {/* Secondary branches */}
              <line x1="50" y1="20" x2="45" y2="15" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="20" x2="55" y2="15" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="75" y1="32" x2="80" y2="27" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="75" y1="32" x2="77" y2="37" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="75" y1="68" x2="80" y2="73" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="75" y1="68" x2="77" y2="63" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="80" x2="45" y2="85" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="80" x2="55" y2="85" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="68" x2="20" y2="73" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="68" x2="23" y2="63" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="32" x2="20" y2="27" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="32" x2="23" y2="37" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              {/* Inner sparkles */}
              <circle cx="50" cy="50" r="4" fill="#ffffff" opacity="1" />
              <circle cx="50" cy="35" r="2" fill="#ffffff" opacity="1" />
              <circle cx="60" cy="42" r="2" fill="#ffffff" opacity="1" />
              <circle cx="60" cy="58" r="2" fill="#ffffff" opacity="1" />
              <circle cx="50" cy="65" r="2" fill="#ffffff" opacity="1" />
              <circle cx="40" cy="58" r="2" fill="#ffffff" opacity="1" />
              <circle cx="40" cy="42" r="2" fill="#ffffff" opacity="1" />
            </g>
          </svg>
          </div>
        </div>
      ))}


      

      <style jsx>{`
        @keyframes snowfall {
          from {
            transform: translateY(-20px);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes fall {
          from {
            transform: translateY(-100px);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes snowman-descent {
          0% {
            opacity: 0;
            transform: translate3d(0, -500px, 0) scale3d(0.3, 0.3, 1);
          }
          20% {
            opacity: 0.4;
            transform: translate3d(0, -350px, 0) scale3d(0.5, 0.5, 1);
          }
          40% {
            opacity: 0.7;
            transform: translate3d(0, -200px, 0) scale3d(0.7, 0.7, 1);
          }
          60% {
            opacity: 0.9;
            transform: translate3d(0, -100px, 0) scale3d(0.85, 0.85, 1);
          }
          80% {
            opacity: 1;
            transform: translate3d(0, -20px, 0) scale3d(0.95, 0.95, 1);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
          }
        }

        @keyframes snowman-fade-out {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
          }
          20% {
            opacity: 0.8;
            transform: translate3d(0, -40px, 0) scale3d(0.96, 0.96, 1);
          }
          40% {
            opacity: 0.6;
            transform: translate3d(0, -80px, 0) scale3d(0.92, 0.92, 1);
          }
          60% {
            opacity: 0.4;
            transform: translate3d(0, -120px, 0) scale3d(0.88, 0.88, 1);
          }
          80% {
            opacity: 0.2;
            transform: translate3d(0, -160px, 0) scale3d(0.84, 0.84, 1);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -200px, 0) scale3d(0.8, 0.8, 1);
          }
        }
      `}</style>
    </div>
  );
}