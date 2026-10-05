import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, RefreshCw, Dices } from 'lucide-react';
import { NEURAL_FACES, NeuralPirinolaFace } from '../types/neural';
import { soundFx } from '../utils/audio';

interface Pirinola3DProps {
  currentFace: NeuralPirinolaFace;
  isSpinning: boolean;
  spinTrigger?: number;
  spinTargetIndex?: number;
  showControls?: boolean;
  onSpinStart: () => void;
  onSpinEnd: (face: NeuralPirinolaFace) => void;
}

export const Pirinola3D: React.FC<Pirinola3DProps> = ({
  currentFace,
  isSpinning,
  spinTrigger = 0,
  spinTargetIndex,
  showControls = true,
  onSpinStart,
  onSpinEnd,
}) => {
  const [currentRotationY, setCurrentRotationY] = useState(0);
  const [wobbleX, setWobbleX] = useState(-14);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processedTriggerRef = useRef(0);
  const totalSpinsRef = useRef(0);

  // Trigger spin
  const triggerSpin = (specificFaceIndex?: number) => {
    if (isSpinning) return;
    onSpinStart();

    // Pick target face
    const targetIdx = specificFaceIndex !== undefined
      ? specificFaceIndex
      : spinTargetIndex !== undefined
        ? spinTargetIndex
        : Math.floor(Math.random() * NEURAL_FACES.length);
    const selectedFace = NEURAL_FACES[targetIdx];

    // Compute rotation
    totalSpinsRef.current += 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const targetDeg = (totalSpinsRef.current * 360) - (targetIdx * 60);

    setWobbleX(-22); // Tilt more while spinning
    setCurrentRotationY(targetDeg);

    // Audio tick loop
    let tickCount = 0;
    const totalTicks = 24;
    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    spinIntervalRef.current = setInterval(() => {
      soundFx.playTick((tickCount % 6) * 30);
      tickCount++;
      if (tickCount >= totalTicks) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      }
    }, 110);

    // Stop after animation duration (2.8s)
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      setWobbleX(-14);
      onSpinEnd(selectedFace);
      soundFx.playLand(selectedFace.id);
      spinTimeoutRef.current = null;
    }, 2800);
  };

  useEffect(() => {
    if (spinTrigger > 0 && spinTrigger !== processedTriggerRef.current && !isSpinning) {
      processedTriggerRef.current = spinTrigger;
      triggerSpin();
    }
  }, [spinTrigger, spinTargetIndex, isSpinning]);

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full relative">
      {/* 3D Scene Viewport */}
      <div 
        className="relative w-full max-w-[340px] h-[360px] flex items-center justify-center select-none"
        style={{ perspective: '1100px' }}
      >
        {/* Ambient Glow */}
        <div 
          className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{
            backgroundColor: isSpinning ? 'rgba(245, 158, 11, 0.25)' : currentFace.glowColor,
          }}
        />

        {/* 3D Rotating Pirinola Assembly */}
        <div
          className="relative w-[150px] h-[190px] flex items-center justify-center cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${wobbleX}deg) rotateY(${currentRotationY}deg)`,
            transition: isSpinning 
              ? 'transform 2.8s cubic-bezier(0.12, 0.85, 0.32, 1)' 
              : 'transform 0.4s ease-out',
          }}
          onClick={() => triggerSpin()}
          title="Haz clic para girar la pirinola"
        >
          {/* Top Handle / Eje superior de giro */}
          <div
            className="absolute -top-16 w-8 h-18 rounded-t-full bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 border-t-2 border-amber-300 shadow-lg flex flex-col items-center justify-start pt-1"
            style={{
              transform: 'translateZ(0px)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)',
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-xs border border-amber-400" />
            <div className="w-1.5 h-10 bg-amber-900/60 rounded-full mt-1" />
          </div>

          {/* 6 Hexagonal Prism Faces */}
          {NEURAL_FACES.map((face) => {
            const isSelected = currentFace.id === face.id;
            const angle = face.index * 60;
            // Radius for 150px width face: 150 / (2 * tan(30deg)) ≈ 130px
            const translateZ = 130;

            return (
              <div
                key={face.id}
                className={`absolute w-[150px] h-[190px] rounded-xl flex flex-col items-center justify-between p-3.5 text-center transition-all backface-hidden border-2 ${
                  isSelected && !isSpinning
                    ? 'ring-4 ring-white shadow-2xl brightness-110'
                    : 'brightness-95 opacity-90'
                }`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
                  background: `linear-gradient(170deg, rgba(30, 27, 46, 0.95) 0%, rgba(15, 12, 28, 0.98) 100%)`,
                  borderColor: isSelected && !isSpinning ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isSelected && !isSpinning
                    ? '0 0 25px rgba(245, 158, 11, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.2)'
                    : 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Face Header / Number */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1 border-b border-white/10 pb-1">
                  <span className="font-bold text-amber-400">#{face.index + 1}</span>
                  <span className="text-[10px] tracking-wide uppercase text-zinc-300">Red Neuronal</span>
                </div>

                {/* Face Emoji & Center Visual */}
                <div className="flex flex-col items-center my-auto">
                  <div className="text-4xl sm:text-5xl filter drop-shadow-md transform hover:scale-110 transition-transform">
                    {face.emoji}
                  </div>
                  <h4 className="text-base font-black text-white tracking-tight mt-1">
                    {face.title}
                  </h4>
                  <span className="text-[10px] text-zinc-300 font-medium px-2 py-0.5 rounded-full bg-white/10 mt-1 line-clamp-1">
                    {face.summary.slice(0, 32)}...
                  </span>
                </div>

                {/* Face Footer Badge */}
                <div className="w-full pt-1 border-t border-white/10">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${face.accentColor}`}>
                    {face.role.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bottom Spindle Point / Punta inferior */}
          <div
            className="absolute -bottom-12 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[34px] border-t-amber-800 drop-shadow-2xl"
            style={{
              transform: 'translateZ(0px)',
              filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.6))',
            }}
          />
        </div>
      </div>

      {showControls && (
      <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-sm">
        <button
          onClick={() => triggerSpin()}
          disabled={isSpinning}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all duration-200 ${
            isSpinning
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-amber-500/25 ring-2 ring-white/20'
          }`}
        >
          {isSpinning ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
              <span>¡La pirinola está girando!</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current text-white" />
              <span>¡Gira la pirinola!</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </>
          )}
        </button>

        {/* Quick Selection Buttons for all 6 faces */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              O elige una etapa directamente:
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {NEURAL_FACES.map((face) => (
              <button
                key={face.id}
                onClick={() => {
                  if (!isSpinning) {
                    triggerSpin(face.index);
                  }
                }}
                disabled={isSpinning}
                className={`py-1.5 px-1 rounded-xl text-center border transition-all ${
                  currentFace.id === face.id
                    ? 'border-amber-400 bg-amber-400/20 text-white font-bold shadow-xs'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title={face.title}
              >
                <div className="text-base">{face.emoji}</div>
                <div className="text-[9px] truncate">{face.title.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
