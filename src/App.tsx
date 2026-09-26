import { useState, useEffect } from 'react';
import { Pirinola3D } from './components/Pirinola3D';
import { ConceptExplainer } from './components/ConceptExplainer';
import { NeuralNetworkDiagram } from './components/NeuralNetworkDiagram';
import { FruitTester } from './components/FruitTester';
import { GuidedTourOverlay } from './components/GuidedTourOverlay';
import { SewingMetaphorExplorer } from './components/SewingMetaphorExplorer';
import { DuelMode } from './components/DuelMode';
import { NEURAL_FACES, SAMPLE_FRUITS, NeuralPirinolaFace, FruitSample } from './types/neural';
import { soundFx } from './utils/audio';
import { BrainCircuit, Volume2, VolumeX, Compass, Layers, Scissors, Sparkles, Swords, Keyboard } from 'lucide-react';

export default function App() {
  const [currentFace, setCurrentFace] = useState<NeuralPirinolaFace>(NEURAL_FACES[0]);
  const [selectedFruit, setSelectedFruit] = useState<FruitSample>(SAMPLE_FRUITS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'pirinola' | 'sewing' | 'duel'>('pirinola');
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  const toggleSound = () => {
    soundFx.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setAriaAnnouncement('La pirinola está girando...');
  };

  const handleSpinEnd = (face: NeuralPirinolaFace) => {
    setIsSpinning(false);
    setCurrentFace(face);
    setAriaAnnouncement(`La pirinola se detuvo en la etapa ${face.index + 1}: ${face.title}, ${face.role}.`);

    // If mystery face landed, switch to pitahaya sample to demonstrate OOD!
    if (face.id === 'misteriosa') {
      const mystery = SAMPLE_FRUITS.find((f) => f.id === 'pitahaya');
      if (mystery) setSelectedFruit(mystery);
    }
  };

  const triggerSpinToFace = (index: number) => {
    setSpinTrigger((prev) => prev + 1);
  };

  // Keyboard Shortcuts for enhanced UX Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing shortcuts when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && activeTab === 'pirinola' && !isSpinning) {
        e.preventDefault();
        setSpinTrigger((prev) => prev + 1);
      } else if (e.key >= '1' && e.key <= '6' && !isSpinning) {
        const faceIdx = parseInt(e.key, 10) - 1;
        if (NEURAL_FACES[faceIdx]) {
          setCurrentFace(NEURAL_FACES[faceIdx]);
          soundFx.playLand(NEURAL_FACES[faceIdx].id);
        }
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGuideOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      } else if (e.key === 'p' || e.key === 'P') {
        setActiveTab('pirinola');
      } else if (e.key === 'd' || e.key === 'D') {
        setActiveTab('duel');
      } else if (e.key === 's' || e.key === 'S') {
        setActiveTab('sewing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isSpinning]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Screen Reader ARIA Live Region for Accessibility */}
      <div aria-live="polite" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full bg-zinc-900/90 border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <BrainCircuit className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  Pirinola de Redes Neuronales
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Neural Top 3D
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Aprende IA jugando con un trompo 3D y la metáfora del taller de costura
              </p>
            </div>
          </div>

          {/* View Switcher & Actions */}
          <div className="flex items-center gap-2">
            {/* Guide Toggle Button */}
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                isGuideOpen
                  ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md animate-pulse'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="Abrir o cerrar la Guía Paso a Paso [Tecla G]"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{isGuideOpen ? 'Guía Activa' : 'Guía Paso a Paso'}</span>
            </button>

            {/* Navigation Tabs */}
            <div className="flex items-center p-1 bg-zinc-800/90 rounded-xl border border-zinc-700/80" role="tablist">
              <button
                onClick={() => setActiveTab('pirinola')}
                role="tab"
                aria-selected={activeTab === 'pirinola'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  activeTab === 'pirinola'
                    ? 'bg-amber-500 text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Pirinola 3D [Tecla P]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pirinola 3D</span>
              </button>

              <button
                onClick={() => setActiveTab('duel')}
                role="tab"
                aria-selected={activeTab === 'duel'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  activeTab === 'duel'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Modo Duelo Competitivo [Tecla D]"
              >
                <Swords className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                <span>Modo Duelo ⚔️</span>
              </button>

              <button
                onClick={() => setActiveTab('sewing')}
                role="tab"
                aria-selected={activeTab === 'sewing'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  activeTab === 'sewing'
                    ? 'bg-amber-500 text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Taller de Costura [Tecla S]"
              >
                <Scissors className="w-3.5 h-3.5 text-zinc-900" />
                <span>Taller Costura</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              title={soundOn ? 'Silenciar sonidos [Tecla M]' : 'Activar sonidos [Tecla M]'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {activeTab === 'pirinola' ? (
          <>
            {/* Hero / Stage Grid: 3D Pirinola (Left) + Pedagogical Concept (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: 3D Pirinola Trompo */}
              <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between min-h-[460px]">
                <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    Trompo 3D de 6 Caras
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {isSpinning ? 'Girando...' : currentFace.title}
                  </span>
                </div>

                <Pirinola3D
                  currentFace={currentFace}
                  isSpinning={isSpinning}
                  spinTrigger={spinTrigger}
                  onSpinStart={handleSpinStart}
                  onSpinEnd={handleSpinEnd}
                  onSelectFaceDirectly={(face) => {
                    if (!isSpinning) setCurrentFace(face);
                  }}
                />
              </div>

              {/* Right Column: Pedagogical Concept Explainer */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <ConceptExplainer
                  currentFace={currentFace}
                  isSpinning={isSpinning}
                  onSpinAgain={() => {
                    setSpinTrigger((prev) => prev + 1);
                  }}
                />
              </div>
            </div>

            {/* Middle Section: Architecture of the Neural Network */}
            <div className="w-full">
              <NeuralNetworkDiagram
                currentFace={currentFace}
                selectedFruit={selectedFruit}
                isSpinning={isSpinning}
              />
            </div>

            {/* Bottom Section: Fruit Tester Bank */}
            <div className="w-full">
              <FruitTester
                selectedFruit={selectedFruit}
                onSelectFruit={setSelectedFruit}
              />
            </div>
          </>
        ) : activeTab === 'duel' ? (
          <DuelMode />
        ) : (
          <SewingMetaphorExplorer
            onSelectLevelToPirinola={(faceIndex) => {
              setActiveTab('pirinola');
              setCurrentFace(NEURAL_FACES[faceIndex]);
              setSpinTrigger((prev) => prev + 1);
            }}
          />
        )}
      </main>

      {/* Guided Tour Overlay Layer */}
      <GuidedTourOverlay
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentFace={currentFace}
        selectedFruit={selectedFruit}
        onSelectFace={setCurrentFace}
        onTriggerSpinToFace={triggerSpinToFace}
      />

      {/* UX Keyboard Shortcuts Helper Pill */}
      <div className="fixed bottom-3 right-4 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md text-[11px] text-zinc-400 shadow-lg">
        <Keyboard className="w-3.5 h-3.5 text-amber-400" />
        <span><strong className="text-zinc-200">[Espacio]</strong> Girar</span>
        <span>•</span>
        <span><strong className="text-zinc-200">[1-6]</strong> Etapas</span>
        <span>•</span>
        <span><strong className="text-zinc-200">[G]</strong> Guía</span>
        <span>•</span>
        <span><strong className="text-zinc-200">[M]</strong> Mute</span>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-900/60 py-6 px-4 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">
          <strong>Pirinola de Redes Neuronales</strong> — Explicación visual e interactiva de Machine Learning con la metáfora del Taller de Costura y Modo Duelo Competitivo.
        </p>
        <p>
          Inspirado en el juego tradicional del trompo y desarrollado con React, TypeScript, Tailwind CSS y CSS 3D Transforms.
        </p>
      </footer>
    </div>
  );
}
