import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NEURAL_FACES, NeuralPirinolaFace, FruitSample } from '../types/neural';
import { 
  Compass, ChevronLeft, ChevronRight, Play, Pause, X, Zap, 
  Layers, ArrowRight, HelpCircle, CheckCircle2, RotateCw
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface GuidedTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentFace: NeuralPirinolaFace;
  selectedFruit: FruitSample;
  onSelectFace: (face: NeuralPirinolaFace) => void;
  onTriggerSpinToFace: (index: number) => void;
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  isOpen,
  onClose,
  currentFace,
  selectedFruit,
  onSelectFace,
  onTriggerSpinToFace,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentFace.index);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Sync with current face when changed externally
  useEffect(() => {
    setCurrentStepIndex(currentFace.index);
  }, [currentFace.index]);

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const nextIdx = (prev + 1) % NEURAL_FACES.length;
          const nextFace = NEURAL_FACES[nextIdx];
          onSelectFace(nextFace);
          soundFx.playLand(nextFace.id);
          return nextIdx;
        });
      }, 4500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, isOpen, onSelectFace]);

  if (!isOpen) return null;

  const stepFace = NEURAL_FACES[currentStepIndex];

  const handleNext = () => {
    const nextIdx = (currentStepIndex + 1) % NEURAL_FACES.length;
    setCurrentStepIndex(nextIdx);
    onSelectFace(NEURAL_FACES[nextIdx]);
    soundFx.playLand(NEURAL_FACES[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentStepIndex - 1 + NEURAL_FACES.length) % NEURAL_FACES.length;
    setCurrentStepIndex(prevIdx);
    onSelectFace(NEURAL_FACES[prevIdx]);
    soundFx.playLand(NEURAL_FACES[prevIdx].id);
  };

  const handleStepClick = (idx: number) => {
    setCurrentStepIndex(idx);
    onSelectFace(NEURAL_FACES[idx]);
    soundFx.playLand(NEURAL_FACES[idx].id);
  };

  // Specific connection explanation matching the user's prompt request
  const getConnectionExplanation = (face: NeuralPirinolaFace, fruit: FruitSample) => {
    switch (face.id) {
      case 'entrada':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Capa de Entrada (3 Nodos: Color, Tamaño, Dulzura)',
          connectionText: `Cuando la pirinola cae en "Entrada", se captura la fruta activa (${fruit.name} ${fruit.emoji}) y se convierte en datos numéricos: Color (${(fruit.colorVal * 100).toFixed(0)}%), Tamaño (${(fruit.sizeVal * 15).toFixed(1)}cm) y Dulzura (${(fruit.sweetnessVal * 18).toFixed(1)}°Bx).`,
          synapseFlow: 'Datos brutos ➔ Entrada de la red',
        };
      case 'oculta1':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Capa Oculta 1 (4 Nodos: Peso, Acidez, Densidad, Textura)',
          connectionText: `Las 3 entradas de la fruta se multiplican por sus pesos sinápticos iniciales (W₁). Las 4 neuronas de la Capa Oculta 1 combinan el peso con el grado de acidez para saber si la fruta es liviana y agria o pesada y dulce.`,
          synapseFlow: 'Entrada ➔ Multiplicación de Pesos W₁ ➔ Activación ReLU',
        };
      case 'oculta2':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Capa Oculta 2 (3 Nodos: Morfología, Pigmentación, Contorno)',
          connectionText: `Las señales de la Capa Oculta 1 pasan a la Capa Oculta 2. Aquí la red abstrae combinaciones más avanzadas, reconociendo si la silueta es alargada o esférica y clasificando el tono específico del color.`,
          synapseFlow: 'Capa Oculta 1 ➔ Combinaciones complejas ➔ Capa Oculta 2',
        };
      case 'salida':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Capa de Salida (Softmax con % de Probabilidad)',
          connectionText: `Las señales acumuladas se consolidan en la Capa de Salida mediante la función Softmax. La red asigna un porcentaje a cada fruta y selecciona la ganadora con mayor certeza (para la ${fruit.name}, predice ${fruit.expectedOutput} con alta probabilidad).`,
          synapseFlow: 'Capa Oculta 2 ➔ Función Softmax ➔ Predicción Final ✅',
        };
      case 'aprendizaje':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Flujo Inverso de Retropropagación (Backpropagation)',
          connectionText: `Si la predicción fue errónea o imprecisa, la red calcula la Función de Pérdida (Loss) y envía una señal en sentido inverso (de derecha a izquierda) para ajustar los pesos W₁ y W₂. Así la red aprende de sus equivocaciones.`,
          synapseFlow: 'Salida (Error) ➔ Retropropagación ➔ Ajuste de Pesos Sinápticos 🔧',
        };
      case 'misteriosa':
        return {
          from: `Cara de la Pirinola: ${face.emoji} ${face.title}`,
          diagramTarget: 'Alerta Out-of-Distribution (Fruta Desconocida / Incertidumbre)',
          connectionText: `La pirinola cae en la cara sorpresa 🎲. Al recibir una fruta exótica o atípica (como la ${fruit.name}), la red detecta alta entropía o incertidumbre, no puede predecir con seguridad y solicita volver a girar el trompo.`,
          synapseFlow: 'Fruta no entrenada ➔ Incertidumbre elevada ➔ ¡Girar de nuevo!',
        };
    }
  };

  const connectionDetails = getConnectionExplanation(stepFace, selectedFruit);

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-4 z-50 px-4 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.95 }}
          className="pointer-events-auto bg-zinc-900/95 backdrop-blur-xl border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 text-white shadow-2xl shadow-amber-500/20 relative"
        >
          {/* Top Bar inside Guide */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400 text-zinc-950 font-black flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Guía Paso a Paso: Conexión Pirinola ➔ Red Neuronal
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Paso {currentStepIndex + 1} de {NEURAL_FACES.length}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 hidden sm:block">
                  Conoce cómo la cara del trompo activa los nodos y capas del diagrama
                </p>
              </div>
            </div>

            {/* Controls right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isAutoPlaying
                    ? 'bg-amber-400 text-zinc-950 border-amber-300 animate-pulse'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                }`}
                title="Tour automático cada 4.5 segundos"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isAutoPlaying ? 'Pausar Tour' : 'Auto-Tour'}</span>
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expandir Guía' : 'Minimizar Guía'}
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-rose-900/50 border border-zinc-700 text-zinc-400 hover:text-rose-300 transition-colors"
                title="Cerrar Guía Paso a Paso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="mt-4 space-y-4">
              {/* Step Navigation Dots / Badges */}
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {NEURAL_FACES.map((face, idx) => {
                  const isActive = idx === currentStepIndex;
                  return (
                    <button
                      key={face.id}
                      onClick={() => handleStepClick(idx)}
                      className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isActive
                          ? 'border-amber-400 bg-amber-400/25 text-white font-bold ring-2 ring-amber-400/50 shadow-md'
                          : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{face.emoji}</span>
                      <span className="text-[10px] font-bold leading-tight truncate w-full hidden sm:block">
                        {face.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explicit Connection Box (Pirinola ➔ Synapse ➔ Diagram) */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative overflow-hidden space-y-3">
                {/* Visual Connection Beam Banner */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <span className="text-xl">{stepFace.emoji}</span>
                    <span>{connectionDetails.from}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{connectionDetails.synapseFlow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex items-center gap-2 text-indigo-300 font-bold">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>{connectionDetails.diagramTarget}</span>
                  </div>
                </div>

                {/* Main Explanation Paragraph */}
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
                  {connectionDetails.connectionText}
                </p>

                {/* Fruit Analogy Callout */}
                <div className="text-xs text-amber-200 font-medium bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Analogía:</strong> "{stepFace.analogy}"</span>
                  </span>

                  <button
                    onClick={() => onTriggerSpinToFace(stepFace.index)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-[11px] font-extrabold flex items-center gap-1 shrink-0 transition-all shadow-xs"
                    title="Girar el trompo 3D exactamente a esta cara"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Girar Trompo Aquí</span>
                  </button>
                </div>
              </div>

              {/* Prev / Next Footer Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-1.5 border border-zinc-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="text-xs text-zinc-400 font-mono">
                  Etapa: <strong className="text-white">{stepFace.title}</strong> ({stepFace.role})
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
