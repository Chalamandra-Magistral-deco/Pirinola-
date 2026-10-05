import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEWING_LEVELS, SewingLevel } from '../types/neural';
import { 
  Scissors, CheckCircle2, RotateCw, Lightbulb, Brain
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SewingMetaphorExplorerProps {
  onSelectLevelToPirinola: (faceIndex: number) => void;
}

export const SewingMetaphorExplorer: React.FC<SewingMetaphorExplorerProps> = ({
  onSelectLevelToPirinola,
}) => {
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);

  const currentLevel: SewingLevel = SEWING_LEVELS[activeLevelIdx];

  const handleSelectLevel = (idx: number) => {
    setActiveLevelIdx(idx);
    soundFx.playLand(idx === 0 ? 'entrada' : idx === 1 ? 'oculta1' : idx === 2 ? 'aprendizaje' : idx === 3 ? 'oculta2' : 'salida');
  };

  const handleApplyToPirinola = () => {
    onSelectLevelToPirinola(currentLevel.mappedFaceIndex);
    soundFx.playTick(120);
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white relative shadow-xl space-y-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5 text-amber-200" />
            <span>Explicación Conceptual por Niveles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            🧵 Una Red Neuronal es como un Taller de Costura
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Explora la red neuronal paso a paso desde una metáfora simple con aprendices de costura hasta conceptos avanzados de pesos y retropropagación.
          </p>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SEWING_LEVELS.map((lvl, idx) => {
          const isActive = idx === activeLevelIdx;
          return (
            <button
              key={lvl.level}
              onClick={() => handleSelectLevel(idx)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                isActive
                  ? 'border-amber-400 bg-amber-500/20 text-white font-bold ring-2 ring-amber-400/40 shadow-md'
                  : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{lvl.iconEmoji}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                  Nivel {lvl.level}
                </span>
              </div>
              <div>
                <div className="text-xs font-black truncate">{lvl.title}</div>
                <div className="text-[10px] text-zinc-400 font-medium truncate">{lvl.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Level Content Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel.level}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Active Level Card */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-2xl flex items-center justify-center font-bold">
                  {currentLevel.iconEmoji}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {currentLevel.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {currentLevel.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleApplyToPirinola}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <RotateCw className="w-4 h-4" />
                <span>Girar Pirinola 3D a este Nivel</span>
              </button>
            </div>

            {/* Narrative Story */}
            <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-3 font-normal whitespace-pre-line">
              {currentLevel.sewingStory}
            </div>

            {/* Key Takeaway Callout */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-200 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>{currentLevel.takeaway}</div>
            </div>

            {/* Breakdown Pills */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Conceptos Clave de este Nivel:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentLevel.details.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Complete Equivalence Dictionary Table */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              Diccionario de Equivalencias: Taller de Costura ➔ Red Neuronal Artificial
            </h4>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">🧵 La Tela Cruda</span>
                <span className="text-zinc-400">Entrada de datos ($X_1, X_2, X_3$)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">👦 Aprendices</span>
                <span className="text-zinc-400">Neuronas Artificiales</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">✂️ Mesas de Trabajo</span>
                <span className="text-zinc-400">Capas Ocultas (Hidden Layers)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">👕 Camisa Terminada</span>
                <span className="text-zinc-400">Salida / Predicción ($Y$)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">🕵️‍♂️ Jefe de Calidad</span>
                <span className="text-zinc-400">Función de Pérdida (Loss Function)</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-amber-300 font-bold block mb-1">🔙 Regaño / Nota de Ajuste</span>
                <span className="text-zinc-400">Retropropagación (Backpropagation)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
