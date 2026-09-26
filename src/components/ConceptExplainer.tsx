import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralPirinolaFace } from '../types/neural';
import { BookOpen, Lightbulb, Cpu, RotateCw, Scissors, Apple } from 'lucide-react';

interface ConceptExplainerProps {
  currentFace: NeuralPirinolaFace;
  isSpinning: boolean;
  onSpinAgain?: () => void;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({
  currentFace,
  isSpinning,
  onSpinAgain,
}) => {
  const [metaphorMode, setMetaphorMode] = useState<'fruit' | 'sewing'>('fruit');

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden">
      {/* Background radial accent */}
      <div
        className="absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
        style={{ backgroundColor: currentFace.glowColor }}
      />

      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-spin mb-4 border border-amber-500/30">
              <RotateCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">La pirinola está decidiendo la etapa...</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">
              Cada cara del trompo representa un paso fundamental en el pensamiento de una red neuronal.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentFace.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 relative z-10"
          >
            {/* Header Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentFace.glowColor}, rgba(20,20,25,0.9))`,
                  }}
                >
                  {currentFace.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      Cara #{currentFace.index + 1}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 font-semibold">{currentFace.role}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    {currentFace.title}
                  </h2>
                </div>
              </div>

              {/* Toggle Metaphor Mode: Fruit vs Sewing */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-zinc-800/90 rounded-xl border border-zinc-700">
                  <button
                    onClick={() => setMetaphorMode('fruit')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      metaphorMode === 'fruit'
                        ? 'bg-amber-400 text-zinc-950 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Apple className="w-3.5 h-3.5" />
                    <span>Frutas</span>
                  </button>
                  <button
                    onClick={() => setMetaphorMode('sewing')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      metaphorMode === 'sewing'
                        ? 'bg-amber-400 text-zinc-950 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Costura</span>
                  </button>
                </div>

                {currentFace.id === 'misteriosa' && onSpinAgain && (
                  <button
                    onClick={onSpinAgain}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-md transition-all shrink-0"
                  >
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Girar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metaphor Narrative Card */}
            <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                {metaphorMode === 'fruit' ? (
                  <>
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Analogía con Frutas:</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 text-amber-400" />
                    <span>Metáfora: Taller de Costura:</span>
                  </>
                )}
              </div>

              {metaphorMode === 'fruit' ? (
                <>
                  <p className="text-base sm:text-lg font-semibold text-zinc-100 leading-snug">
                    "{currentFace.summary}"
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {currentFace.analogy}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-semibold text-amber-200 leading-snug">
                    {currentFace.sewingMetaphor}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    En el taller de costura, cada aprendiz (neurona) realiza su tarea específica transformando la tela que recibe hasta entregar la prenda perfecta.
                  </p>
                </>
              )}
            </div>

            {/* Two Column Deep Dive: What AI Does vs Technical Concept */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Acción de la Red Neuronal</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentFace.actionCallout}
                </p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Concepto Técnico de IA</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentFace.mlConcept}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
