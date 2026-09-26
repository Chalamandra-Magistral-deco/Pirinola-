import React from 'react';
import { motion } from 'motion/react';
import { NeuralPirinolaFace, FruitSample } from '../types/neural';
import { Activity, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

interface NeuralNetworkDiagramProps {
  currentFace: NeuralPirinolaFace;
  selectedFruit: FruitSample;
  isSpinning: boolean;
}

export const NeuralNetworkDiagram: React.FC<NeuralNetworkDiagramProps> = ({
  currentFace,
  selectedFruit,
  isSpinning,
}) => {
  // Layers definitions
  const inputNodes = [
    { id: 'in-color', name: 'Color', val: selectedFruit.colorVal.toFixed(2), emoji: '🎨', desc: selectedFruit.colorName },
    { id: 'in-size', name: 'Tamaño', val: `${(selectedFruit.sizeVal * 15).toFixed(1)} cm`, emoji: '📏', desc: 'Diámetro estimado' },
    { id: 'in-sweet', name: 'Dulzura', val: `${(selectedFruit.sweetnessVal * 18).toFixed(1)}°Bx`, emoji: '🍯', desc: 'Grados Brix de dulzor' },
  ];

  const hidden1Nodes = [
    { id: 'h1-1', name: 'H₁: Peso', active: currentFace.highlightLayer === 'hidden1' },
    { id: 'h1-2', name: 'H₂: Acidez', active: currentFace.highlightLayer === 'hidden1' },
    { id: 'h1-3', name: 'H₃: Densidad', active: currentFace.highlightLayer === 'hidden1' },
    { id: 'h1-4', name: 'H₄: Textura', active: currentFace.highlightLayer === 'hidden1' },
  ];

  const hidden2Nodes = [
    { id: 'h2-1', name: 'H₂₁: Morfología', active: currentFace.highlightLayer === 'hidden2' },
    { id: 'h2-2', name: 'H₂₂: Pigmentación', active: currentFace.highlightLayer === 'hidden2' },
    { id: 'h2-3', name: 'H₂₃: Contorno', active: currentFace.highlightLayer === 'hidden2' },
  ];

  // Calculate dynamic probabilities based on selected fruit
  const isMystery = selectedFruit.id === 'pitahaya';
  const outputNodes = [
    { id: 'out-manzana', name: 'Manzana 🍎', prob: isMystery ? 22 : selectedFruit.id === 'manzana' ? 92 : selectedFruit.id === 'fresa' ? 12 : 3 },
    { id: 'out-platano', name: 'Plátano 🍌', prob: isMystery ? 18 : selectedFruit.id === 'platano' ? 94 : 2 },
    { id: 'out-naranja', name: 'Naranja 🍊', prob: isMystery ? 24 : selectedFruit.id === 'naranja' ? 89 : selectedFruit.id === 'limon' ? 15 : 4 },
    { id: 'out-limon', name: 'Limón 🍋', prob: isMystery ? 26 : selectedFruit.id === 'limon' ? 95 : 1 },
    { id: 'out-fresa', name: 'Fresa 🍓', prob: isMystery ? 10 : selectedFruit.id === 'fresa' ? 91 : selectedFruit.id === 'manzana' ? 5 : 2 },
  ];

  const isLayerActive = (layer: string) => {
    if (isSpinning) return false;
    return currentFace.highlightLayer === layer;
  };

  const isBackprop = currentFace.highlightLayer === 'backprop' && !isSpinning;
  const isMysteryActive = currentFace.highlightLayer === 'mystery' && !isSpinning;

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden text-white shadow-xl">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg tracking-tight">
              Arquitectura de la Red Neuronal Artificial
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Observa cómo viaja la información desde los sensores hasta la clasificación
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: currentFace.accentColor.replace('text-', '') }}
          />
          <span className="font-semibold text-zinc-200">
            {isSpinning ? 'Calculando señales...' : currentFace.role}
          </span>
        </div>
      </div>

      {/* Backprop Notification Banner */}
      {isBackprop && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-blue-500/20 border border-blue-400/40 rounded-2xl flex items-center gap-3 text-xs text-blue-200"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
          <div>
            <strong>Retropropagación activa (Backpropagation):</strong> Las señales de error viajan de derecha a izquierda para ajustar los pesos sinápticos (W) y minimizar la función de costo.
          </div>
        </motion.div>
      )}

      {/* Mystery Warning Banner */}
      {isMysteryActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-pink-500/20 border border-pink-400/40 rounded-2xl flex items-center gap-3 text-xs text-pink-200"
        >
          <AlertCircle className="w-4 h-4 text-pink-400 shrink-0 animate-bounce" />
          <div>
            <strong>¡Caso Fuera de Distribución (OOD)!</strong> La red detecta alta incertidumbre con esta fruta misteriosa. Los valores no coinciden con las categorías entrenadas.
          </div>
        </motion.div>
      )}

      {/* Diagram Layout */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
        {/* Layer 1: Input */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isLayerActive('input')
              ? 'border-red-500 bg-red-950/30 ring-2 ring-red-500/50 shadow-lg shadow-red-950/40'
              : 'border-zinc-800 bg-zinc-950/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
              1. Entrada 🍎
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">X[3]</span>
          </div>

          <div className="space-y-2.5">
            {inputNodes.map((n) => (
              <div
                key={n.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isLayerActive('input')
                    ? 'border-red-400/40 bg-red-900/20 text-white'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span>{n.emoji}</span>
                    <span>{n.name}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded">
                    {n.val}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 truncate">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Hidden Layer 1 */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isLayerActive('hidden1')
              ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/40'
              : 'border-zinc-800 bg-zinc-950/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              2. Oculta 1 ⚖️
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">H₁[4]</span>
          </div>

          <div className="space-y-2">
            {hidden1Nodes.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isLayerActive('hidden1')
                    ? 'border-amber-400/50 bg-amber-900/20 text-white font-semibold'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                }`}
              >
                <span className="truncate">{n.name}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-zinc-800 text-amber-300">
                  ReLU(z)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Hidden Layer 2 */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isLayerActive('hidden2')
              ? 'border-violet-500 bg-violet-950/30 ring-2 ring-violet-500/50 shadow-lg shadow-violet-950/40'
              : 'border-zinc-800 bg-zinc-950/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
              3. Oculta 2 🎨📏
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">H₂[3]</span>
          </div>

          <div className="space-y-2.5">
            {hidden2Nodes.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isLayerActive('hidden2')
                    ? 'border-violet-400/50 bg-violet-900/20 text-white font-semibold'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                }`}
              >
                <span className="truncate">{n.name}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-zinc-800 text-violet-300">
                  W₂ · a₁
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 4: Output */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isLayerActive('output')
              ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/40'
              : 'border-zinc-800 bg-zinc-950/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              4. Salida ✅
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Softmax</span>
          </div>

          <div className="space-y-1.5">
            {outputNodes.map((n) => {
              const isWinner = n.prob >= 50;
              return (
                <div
                  key={n.id}
                  className={`p-1.5 px-2 rounded-xl border text-xs transition-all ${
                    isWinner
                      ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
                      : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{n.name}</span>
                    <span className={`font-mono text-[10px] ${isWinner ? 'text-emerald-300' : 'text-zinc-500'}`}>
                      {n.prob}%
                    </span>
                  </div>
                  {/* Probability Bar */}
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWinner ? 'bg-emerald-400' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${n.prob}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synaptic Flow Direction Indicator */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Flujo de inferencia: <strong className="text-zinc-200">Entrada ➔ Oculta 1 ➔ Oculta 2 ➔ Salida</strong>
          </span>
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          Fruta activa: <strong className="text-white">{selectedFruit.name}</strong>
        </div>
      </div>
    </div>
  );
};
