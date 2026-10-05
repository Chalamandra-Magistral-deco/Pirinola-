import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NEURAL_FACES, NeuralPirinolaFace, FruitSample, SAMPLE_FRUITS } from '../types/neural';
import { Pirinola3D } from './Pirinola3D';
import { soundFx } from '../utils/audio';
import { 
  Flame, Trophy, Zap, Shield, Swords, Sparkles, CheckCircle2, 
  XCircle, Award, RefreshCw, HelpCircle, Target, Star
} from 'lucide-react';

interface DuelChallenge {
  id: number;
  clueText: string;
  category: string;
  correctFaceId: string;
  fruitSample: FruitSample;
}

const DUEL_CHALLENGES: DuelChallenge[] = [
  {
    id: 1,
    clueText: 'Queremos transformar la fruta en vectores numéricos de Color, Tamaño y Dulzura. ¿En qué cara debe caer?',
    category: 'Captura de Datos',
    correctFaceId: 'entrada',
    fruitSample: SAMPLE_FRUITS[0], // Manzana
  },
  {
    id: 2,
    clueText: 'Las neuronas intermedias van a combinar el peso con la acidez para evaluar si es cítrica o dulce. ¿Qué cara es?',
    category: 'Primera Extracción de Características',
    correctFaceId: 'oculta1',
    fruitSample: SAMPLE_FRUITS[2], // Limón
  },
  {
    id: 3,
    clueText: 'La red examina la silueta alargada, la curvatura y el tono amarillo específico. ¿Qué cara realiza esta abstracción?',
    category: 'Extracción Compleja de Patrones',
    correctFaceId: 'oculta2',
    fruitSample: SAMPLE_FRUITS[1], // Plátano
  },
  {
    id: 4,
    clueText: 'La red aplica Softmax y calcula un 92% de probabilidad de que sea una Naranja Jugosa. ¿En qué cara ocurre la decisión?',
    category: 'Clasificación Final',
    correctFaceId: 'salida',
    fruitSample: SAMPLE_FRUITS[3], // Naranja
  },
  {
    id: 5,
    clueText: '¡El botón de la prenda quedó mal puesto! La señal de error viaja en reversa para reajustar los pesos sinápticos.',
    category: 'Optimización de Pesos',
    correctFaceId: 'aprendizaje',
    fruitSample: SAMPLE_FRUITS[4], // Fresa
  },
  {
    id: 6,
    clueText: 'Apareció una Pitahaya Dragón rosa con escamas. La red no sabe qué es y tiene alta incertidumbre. ¿Qué cara debe salir?',
    category: 'Anomalía / Out-of-Distribution',
    correctFaceId: 'misteriosa',
    fruitSample: SAMPLE_FRUITS[6], // Pitahaya
  },
];

export const DuelMode: React.FC = () => {
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [selectedGuessId, setSelectedGuessId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [shields, setShields] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [landedFace, setLandedFace] = useState<NeuralPirinolaFace>(NEURAL_FACES[0]);
  const [duelResult, setDuelResult] = useState<'idle' | 'win' | 'lose'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);

  const activeChallenge = DUEL_CHALLENGES[currentChallengeIdx];

  // Calculate multiplier based on streak
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : streak >= 2 ? 1.5 : 1;

  const handleStartDuelSpin = () => {
    if (!selectedGuessId || isSpinning) return;
    setIsSpinning(true);
    setDuelResult('idle');
    setShowConfetti(false);
    setSpinTrigger((prev) => prev + 1);
  };

  const handleSpinEnd = (face: NeuralPirinolaFace) => {
    setIsSpinning(false);
    setLandedFace(face);

    const isCorrect = selectedGuessId === face.id;

    if (isCorrect) {
      // WIN
      const gainedPoints = Math.round(100 * multiplier);
      setScore((prev) => prev + gainedPoints);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setDuelResult('win');
      setShowConfetti(true);

      if (newStreak >= 3) {
        soundFx.playStreakMultiplier();
      } else {
        soundFx.playWin();
      }

      // Hide confetti after 3.5s
      setTimeout(() => setShowConfetti(false), 3500);
    } else {
      // LOSE
      if (shields > 0) {
        // Shield saves the streak!
        setShields((prev) => prev - 1);
        soundFx.playLose();
        setDuelResult('lose');
      } else {
        setStreak(0);
        soundFx.playLose();
        setDuelResult('lose');
      }
    }
  };

  const handleNextChallenge = () => {
    setDuelResult('idle');
    setSelectedGuessId(null);
    setShowConfetti(false);
    setCurrentChallengeIdx((prev) => (prev + 1) % DUEL_CHALLENGES.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 relative select-none">
      {/* Confetti Visual Stimuli Layer */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: Math.random() * 0.8 + 0.6,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  rotate: Math.random() * 720,
                  opacity: 0,
                }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{
                  backgroundColor: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][
                    i % 6
                  ],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Duel Scoreboard & Stimuli Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 font-black">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Modo Duelo Competitivo
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-zinc-950 uppercase tracking-wider">
                  IA Battle
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Adivina la etapa correcta, mantén tu racha e incrementa tus multiplicadores
              </p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-3 text-xs font-bold">
            {/* Streak Counter */}
            <div className="px-3.5 py-2 rounded-2xl bg-zinc-950 border border-amber-500/40 flex items-center gap-2 shadow-inner">
              <Flame className={`w-5 h-5 ${streak > 0 ? 'text-amber-400 animate-bounce' : 'text-zinc-600'}`} />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Racha Actual</span>
                <span className="text-sm font-black text-amber-300">🔥 {streak}</span>
              </div>
            </div>

            {/* Max Streak */}
            <div className="px-3.5 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Máximo Récord</span>
                <span className="text-sm font-black text-white">🏆 {maxStreak}</span>
              </div>
            </div>

            {/* Multiplier Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-amber-500 text-zinc-950 font-black text-sm flex items-center gap-1 shadow-md">
              <Zap className="w-4 h-4" />
              <span>x{multiplier}</span>
            </div>

            {/* Score */}
            <div className="px-3.5 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-1.5 text-amber-400 font-mono font-bold text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{score} PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Duel Challenge Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive 3D Pirinola Spinner */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Trompo de Desafío
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Desafío #{currentChallengeIdx + 1} de {DUEL_CHALLENGES.length}
            </span>
          </div>

          <Pirinola3D
            currentFace={landedFace}
            isSpinning={isSpinning}
            spinTrigger={spinTrigger}
            showControls={false}
            onSpinStart={() => setIsSpinning(true)}
            onSpinEnd={handleSpinEnd}
          />

          {/* Primary Action CTA */}
          <button
            onClick={handleStartDuelSpin}
            disabled={!selectedGuessId || isSpinning}
            className={`w-full mt-4 py-4 px-6 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${
              !selectedGuessId
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : isSpinning
                ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white hover:scale-105 active:scale-95 shadow-amber-500/30 ring-2 ring-white/20'
            }`}
          >
            {isSpinning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-200" />
                <span>GIRANDO EL TROMPO EN DUELO...</span>
              </>
            ) : !selectedGuessId ? (
              <>
                <HelpCircle className="w-5 h-5 text-zinc-500" />
                <span>ELIGE TU PREDICCIÓN PRIMERO</span>
              </>
            ) : (
              <>
                <Swords className="w-5 h-5 text-white animate-bounce" />
                <span>¡GIRAR Y PROBAR MI PREDICCIÓN!</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Challenge Clue & Prediction Selection Cards */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between space-y-6">
          {/* Challenge Clue Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Pista del Desafío: {activeChallenge.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                Fruta Muestra: {activeChallenge.fruitSample.emoji} {activeChallenge.fruitSample.name}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-zinc-100 leading-snug bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
              "{activeChallenge.clueText}"
            </p>
          </div>

          {/* 6 Prediction Options Grid */}
          <div className="space-y-2">
            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Selecciona la cara en la que crees que se detendrá el trompo:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {NEURAL_FACES.map((face) => {
                const isSelected = selectedGuessId === face.id;
                return (
                  <button
                    key={face.id}
                    onClick={() => {
                      if (!isSpinning && duelResult === 'idle') {
                        setSelectedGuessId(face.id);
                        soundFx.playTick(100);
                      }
                    }}
                    disabled={isSpinning || duelResult !== 'idle'}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/20 text-white font-bold ring-2 ring-amber-400/50 shadow-lg scale-105'
                        : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{face.emoji}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-black truncate">{face.title}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{face.role.split(' ')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Banner Stimuli (Win / Lose) */}
          <AnimatePresence>
            {duelResult !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  duelResult === 'win'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-rose-500/20 border-rose-400 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {duelResult === 'win' ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-zinc-950 flex items-center justify-center font-black text-2xl shrink-0 animate-bounce">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-2xl shrink-0">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-black text-white">
                      {duelResult === 'win'
                        ? `¡ACIERTO TOTAL! 🎉 (+${Math.round(100 * multiplier)} PTS)`
                        : `¡CASI! Cayó en ${landedFace.emoji} ${landedFace.title}`}
                    </h4>
                    <p className="text-xs mt-0.5 text-zinc-300">
                      {duelResult === 'win'
                        ? `¡Excelente intuición! Tu racha subió a 🔥 ${streak}.`
                        : `La cara correcta para la pista era ${NEURAL_FACES.find((f) => f.id === activeChallenge.correctFaceId)?.emoji} ${NEURAL_FACES.find((f) => f.id === activeChallenge.correctFaceId)?.title}.`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextChallenge}
                  className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-black text-xs flex items-center gap-2 hover:bg-zinc-200 shadow-md transition-all shrink-0"
                >
                  <span>Siguiente Desafío</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
