import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, Volume2, VolumeX, Users, Trophy, Sparkles, 
  Flame, Dice5, History, Plus, Minus, Shuffle, HelpCircle, Award
} from 'lucide-react';

export type GameMode = 'tradicional' | 'chalamandra';

export interface Player {
  id: string;
  name: string;
  chips: number;
  color: string;
  isEliminated: boolean;
}

export interface PirinolaFace {
  id: string;
  label: string;
  subtitle: string;
  actionType: 'pon1' | 'pon2' | 'toma1' | 'toma2' | 'todos' | 'tomatodo' | 'reto';
  chipsChange: number; // for individual
  partyChallenge?: string;
  colorBg: string;
  textColor: string;
}

const TRADITIONAL_FACES: PirinolaFace[] = [
  {
    id: 'pon-1',
    label: 'PON 1',
    subtitle: 'Coloca 1 ficha al centro',
    actionType: 'pon1',
    chipsChange: -1,
    partyChallenge: 'Toma 1 sorbo de tu bebida',
    colorBg: 'from-amber-600 to-amber-700',
    textColor: 'text-amber-100',
  },
  {
    id: 'toma-1',
    label: 'TOMA 1',
    subtitle: 'Toma 1 ficha del pozo',
    actionType: 'toma1',
    chipsChange: 1,
    partyChallenge: 'Manda 1 trago a quien tú elijas',
    colorBg: 'from-emerald-600 to-emerald-700',
    textColor: 'text-emerald-100',
  },
  {
    id: 'pon-2',
    label: 'PON 2',
    subtitle: 'Coloca 2 fichas al centro',
    actionType: 'pon2',
    chipsChange: -2,
    partyChallenge: 'Haz 5 sentadillas o toma 2 tragos',
    colorBg: 'from-rose-600 to-rose-700',
    textColor: 'text-rose-100',
  },
  {
    id: 'toma-2',
    label: 'TOMA 2',
    subtitle: 'Toma 2 fichas del pozo',
    actionType: 'toma2',
    chipsChange: 2,
    partyChallenge: 'Elige a 2 amigos para brindar',
    colorBg: 'from-teal-600 to-teal-700',
    textColor: 'text-teal-100',
  },
  {
    id: 'todos-ponen',
    label: 'TODOS PONEN',
    subtitle: '¡Todos ponen 1 ficha al pozo!',
    actionType: 'todos',
    chipsChange: -1,
    partyChallenge: '¡Fondo o ronda de chistes para todos!',
    colorBg: 'from-purple-600 to-purple-800',
    textColor: 'text-purple-100',
  },
  {
    id: 'toma-todo',
    label: '¡TOMA TODO!',
    subtitle: '¡Te llevas todo el pozo acumulado!',
    actionType: 'tomatodo',
    chipsChange: 0, // dynamic
    partyChallenge: '¡Corona de la fiesta! Inventa una regla nueva',
    colorBg: 'from-yellow-500 to-amber-500',
    textColor: 'text-amber-950',
  },
];

const PLAYER_COLORS = [
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

// Web Audio sound synthesizer
class SoundEffects {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  spinClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240 + Math.random() * 80, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  coinClink() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  fanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }
}

const sfx = new SoundEffects();

export const PirinolaGame: React.FC = () => {
  // Game Setup State
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Jugador 1', chips: 10, color: PLAYER_COLORS[0], isEliminated: false },
    { id: '2', name: 'Jugador 2', chips: 10, color: PLAYER_COLORS[1], isEliminated: false },
    { id: '3', name: 'Jugador 3', chips: 10, color: PLAYER_COLORS[2], isEliminated: false },
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [pot, setPot] = useState(6);
  const [initialChips] = useState(10);
  const [gameMode, setGameMode] = useState<GameMode>('tradicional');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Spinning Animation State
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentFace, setCurrentFace] = useState<PirinolaFace>(TRADITIONAL_FACES[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lastResult, setLastResult] = useState<{
    face: PirinolaFace;
    player: Player;
    message: string;
    chipsDelta: number;
  } | null>(null);
  const [history, setHistory] = useState<Array<{ text: string; time: string }>>([
    { text: '¡Comienza la partida! Cada jugador colocó 2 fichas al pozo.', time: '00:00' },
  ]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const spinSoundInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    sfx.muted = !soundEnabled;
  }, [soundEnabled]);

  const activePlayer = players[activePlayerIndex];

  // Spin Pirinola
  const handleSpin = () => {
    if (isSpinning || winner) return;

    setIsSpinning(true);
    setLastResult(null);

    // Pick random outcome
    const targetFaceIndex = Math.floor(Math.random() * TRADITIONAL_FACES.length);
    const selectedFace = TRADITIONAL_FACES[targetFaceIndex];

    // Calculate rotation: 6 faces = 60 degrees each
    const fullSpins = 5 + Math.floor(Math.random() * 4); // 5 to 8 full turns
    const targetDeg = rotationAngle + (fullSpins * 360) + (targetFaceIndex * 60);
    setRotationAngle(targetDeg);

    // Audio clicks during spinning
    let clickCount = 0;
    const maxClicks = 22;
    spinSoundInterval.current = setInterval(() => {
      sfx.spinClick();
      clickCount++;
      if (clickCount >= maxClicks) {
        if (spinSoundInterval.current) clearInterval(spinSoundInterval.current);
      }
    }, 110);

    // End of spin
    setTimeout(() => {
      setIsSpinning(false);
      setCurrentFace(selectedFace);
      processOutcome(selectedFace);
    }, 2800);
  };

  // Process game mechanics after spin
  const processOutcome = (face: PirinolaFace) => {
    const p = activePlayer;
    let delta = 0;
    let msg = '';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (face.actionType === 'pon1') {
      const actualDeduct = Math.min(p.chips, 1);
      delta = -actualDeduct;
      setPot((prev) => prev + actualDeduct);
      setPlayers((prev) =>
        prev.map((pl, i) => (i === activePlayerIndex ? { ...pl, chips: pl.chips - actualDeduct } : pl))
      );
      msg = `${p.name} puso 1 ficha al centro.`;
      sfx.coinClink();
    } else if (face.actionType === 'pon2') {
      const actualDeduct = Math.min(p.chips, 2);
      delta = -actualDeduct;
      setPot((prev) => prev + actualDeduct);
      setPlayers((prev) =>
        prev.map((pl, i) => (i === activePlayerIndex ? { ...pl, chips: pl.chips - actualDeduct } : pl))
      );
      msg = `${p.name} puso 2 fichas al centro.`;
      sfx.coinClink();
    } else if (face.actionType === 'toma1') {
      const actualTake = Math.min(pot, 1);
      delta = actualTake;
      setPot((prev) => Math.max(0, prev - actualTake));
      setPlayers((prev) =>
        prev.map((pl, i) => (i === activePlayerIndex ? { ...pl, chips: pl.chips + actualTake } : pl))
      );
      msg = `${p.name} tomó 1 ficha del centro.`;
      sfx.coinClink();
    } else if (face.actionType === 'toma2') {
      const actualTake = Math.min(pot, 2);
      delta = actualTake;
      setPot((prev) => Math.max(0, prev - actualTake));
      setPlayers((prev) =>
        prev.map((pl, i) => (i === activePlayerIndex ? { ...pl, chips: pl.chips + actualTake } : pl))
      );
      msg = `${p.name} tomó 2 fichas del centro.`;
      sfx.coinClink();
    } else if (face.actionType === 'todos') {
      // Each active player puts 1
      let totalAdded = 0;
      setPlayers((prev) =>
        prev.map((pl) => {
          if (pl.chips > 0) {
            totalAdded += 1;
            return { ...pl, chips: pl.chips - 1 };
          }
          return pl;
        })
      );
      setPot((prev) => prev + totalAdded);
      delta = -1;
      msg = `¡TODOS PONEN! Cada jugador aportó 1 ficha al pozo (+${totalAdded}).`;
      sfx.coinClink();
    } else if (face.actionType === 'tomatodo') {
      const winPot = pot;
      delta = winPot;
      setPlayers((prev) =>
        prev.map((pl, i) => (i === activePlayerIndex ? { ...pl, chips: pl.chips + winPot } : pl))
      );
      // Restart pot: everybody puts 1 to continue
      let resetSeed = 0;
      setPlayers((prev) =>
        prev.map((pl) => {
          if (pl.chips > 0) {
            resetSeed += 1;
            return { ...pl, chips: pl.chips - 1 };
          }
          return pl;
        })
      );
      setPot(resetSeed);
      msg = `🎉 ¡${p.name} SACÓ TOMA TODO! Se llevó ${winPot} fichas. Se reinició el pozo con 1 de cada jugador.`;
      sfx.fanfare();
    }

    setLastResult({
      face,
      player: p,
      message: msg,
      chipsDelta: delta,
    });

    setHistory((prev) => [{ text: msg, time: nowTime }, ...prev.slice(0, 19)]);

    // Check winner or next turn
    setTimeout(() => {
      checkGameProgress();
    }, 800);
  };

  const checkGameProgress = () => {
    // Check remaining players with chips
    const alive = players.filter((pl) => pl.chips > 0);
    if (alive.length === 1 && players.length > 1) {
      setWinner(alive[0]);
      sfx.fanfare();
      return;
    }

    // Advance to next alive player
    let nextIdx = (activePlayerIndex + 1) % players.length;
    let attempts = 0;
    while (players[nextIdx].chips <= 0 && attempts < players.length) {
      nextIdx = (nextIdx + 1) % players.length;
      attempts++;
    }
    setActivePlayerIndex(nextIdx);
  };

  const handleResetGame = () => {
    setPlayers([
      { id: '1', name: 'Jugador 1', chips: initialChips, color: PLAYER_COLORS[0], isEliminated: false },
      { id: '2', name: 'Jugador 2', chips: initialChips, color: PLAYER_COLORS[1], isEliminated: false },
      { id: '3', name: 'Jugador 3', chips: initialChips, color: PLAYER_COLORS[2], isEliminated: false },
    ]);
    setActivePlayerIndex(0);
    setPot(6);
    setWinner(null);
    setLastResult(null);
    setHistory([{ text: 'Partida reiniciada.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const handleAddPlayer = () => {
    if (players.length >= 6) return;
    const newId = String(players.length + 1);
    setPlayers((prev) => [
      ...prev,
      {
        id: newId,
        name: `Jugador ${newId}`,
        chips: initialChips,
        color: PLAYER_COLORS[(players.length) % PLAYER_COLORS.length],
        isEliminated: false,
      },
    ]);
  };

  const handleRemovePlayer = () => {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.slice(0, prev.length - 1));
    setActivePlayerIndex(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-900/10 mb-8 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider mb-2">
              <Dice5 className="w-3.5 h-3.5" />
              <span>Juego Tradicional & Fiesta</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              Pirinola Chalamandra
              <span className="text-amber-300 text-2xl animate-bounce">⚡</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-1 max-w-xl">
              Gira el trompo de seis caras, acumula fichas en el pozo central o activa los retos de la Chalamandra.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setGameMode(gameMode === 'tradicional' ? 'chalamandra' : 'tradicional')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-sm ${
                gameMode === 'chalamandra'
                  ? 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-300'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              {gameMode === 'chalamandra' ? 'Modo Chalamandra (Activo)' : 'Activar Modo Chalamandra'}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowRulesModal(true)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Reglas del juego"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Game Stage + Players & Pot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Pirinola Spinner Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between min-h-[480px]">
          {/* Active Turn Header */}
          <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full ring-4 ring-offset-2 ring-slate-100 dark:ring-zinc-800"
                style={{ backgroundColor: activePlayer?.color }}
              />
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Turno de:</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {activePlayer?.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Fichas en mano:</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                🟡 {activePlayer?.chips} fichas
              </p>
            </div>
          </div>

          {/* 3D Pirinola Interactive Graphic */}
          <div className="relative my-8 flex flex-col items-center justify-center">
            {/* Spinning Indicator Glow */}
            <div
              className={`absolute w-64 h-64 rounded-full blur-3xl transition-opacity duration-500 ${
                isSpinning ? 'opacity-70 bg-amber-400/40 animate-pulse' : 'opacity-20 bg-rose-400/30'
              }`}
            />

            {/* The Pirinola Trompo Component */}
            <div className="relative w-56 h-56 flex items-center justify-center select-none">
              {/* Top Handle / Eje superior */}
              <div className="absolute top-0 w-8 h-12 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-t-lg shadow-md z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-inner" />
              </div>

              {/* Central Hexagonal Rotating Body */}
              <div
                className="relative w-44 h-44 rounded-2xl flex items-center justify-center shadow-2xl transition-transform cursor-pointer"
                style={{
                  transform: `rotate(${rotationAngle}deg) scale(${isSpinning ? 0.95 : 1})`,
                  transitionDuration: isSpinning ? '2.8s' : '0.4s',
                  transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.32, 1)',
                  background: 'radial-gradient(circle, #f59e0b 0%, #b45309 60%, #78350f 100%)',
                  boxShadow: isSpinning 
                    ? '0 20px 40px -10px rgba(245, 158, 11, 0.5), inset 0 0 15px rgba(255,255,255,0.4)' 
                    : '0 15px 30px -8px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)',
                }}
                onClick={handleSpin}
              >
                {/* Visual facet lines */}
                <div className="absolute inset-2 border-2 border-dashed border-amber-300/40 rounded-xl" />
                <div className="absolute w-full h-[1px] bg-amber-300/30 top-1/2 -translate-y-1/2" />
                <div className="absolute h-full w-[1px] bg-amber-300/30 left-1/2 -translate-x-1/2" />

                {/* Face label display */}
                <div className="z-10 text-center px-2">
                  <div className="text-xl sm:text-2xl font-black text-amber-50 drop-shadow-md tracking-tight uppercase">
                    {isSpinning ? 'GIRANDO...' : currentFace.label}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-200 mt-1 line-clamp-1">
                    {isSpinning ? '¡Suerte!' : currentFace.subtitle}
                  </div>
                </div>
              </div>

              {/* Bottom Tip / Punta inferior */}
              <div className="absolute bottom-1 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-amber-900 drop-shadow-md z-10" />
            </div>

            {/* Spin CTA Button */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning || !!winner}
                className={`relative px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider flex items-center gap-3 shadow-lg transition-all duration-200 ${
                  isSpinning
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white hover:scale-105 active:scale-95 shadow-amber-500/25 ring-2 ring-white/30'
                }`}
              >
                {isSpinning ? (
                  <>
                    <Shuffle className="w-5 h-5 animate-spin" />
                    <span>Girando Trompo...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>¡Girar Pirinola!</span>
                  </>
                )}
              </button>
              <span className="text-xs text-slate-400">O haz clic directamente sobre la pirinola</span>
            </div>
          </div>

          {/* Outcome Notification Card */}
          <AnimatePresence mode="wait">
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`w-full p-4 rounded-2xl border text-center transition-all bg-gradient-to-r ${lastResult.face.colorBg} text-white shadow-md`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">Resultado del Giro</span>
                </div>
                <h4 className="text-2xl font-black">{lastResult.face.label}</h4>
                <p className="text-sm font-medium mt-0.5 opacity-90">{lastResult.message}</p>

                {gameMode === 'chalamandra' && lastResult.face.partyChallenge && (
                  <div className="mt-3 pt-2.5 border-t border-white/20 text-xs font-semibold flex items-center justify-center gap-1.5 text-amber-200">
                    <Flame className="w-4 h-4" />
                    <span>Reto Chalamandra: {lastResult.face.partyChallenge}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Pot Center + Players Board + History */}
        <div className="lg:col-span-5 space-y-6">
          {/* El Pozo Central (The Pot) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100/70 dark:from-zinc-900 dark:to-amber-950/20 border-2 border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Pozo Acumulado
              </span>
              <span className="text-xs text-amber-700/70 dark:text-amber-400/60 font-semibold">
                Centro de la mesa
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-amber-900 dark:text-amber-300">
                  {pot}
                </span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">fichas</span>
              </div>

              {/* Visual chips stack */}
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(pot, 7) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-600 shadow-md flex items-center justify-center text-[10px] font-black text-amber-950 transform hover:-translate-y-1 transition-transform"
                    style={{ zIndex: i }}
                  >
                    🪙
                  </div>
                ))}
                {pot > 7 && (
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center border-2 border-amber-800">
                    +{pot - 7}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Jugadores ({players.length})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRemovePlayer}
                  disabled={players.length <= 2 || isSpinning}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40"
                  title="Eliminar jugador"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleAddPlayer}
                  disabled={players.length >= 6 || isSpinning}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40"
                  title="Agregar jugador"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {players.map((pl, idx) => {
                const isCurrent = idx === activePlayerIndex;
                const isOut = pl.chips <= 0;

                return (
                  <div
                    key={pl.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-800/40'
                    } ${isOut ? 'opacity-40 line-through' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs"
                        style={{ backgroundColor: pl.color }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {pl.name}
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[10px] font-semibold uppercase">
                              Tira
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800 dark:text-zinc-200">
                        {pl.chips} {pl.chips === 1 ? 'ficha' : 'fichas'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Restart button */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={handleResetGame}
                disabled={isSpinning}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Partida</span>
              </button>
            </div>
          </div>

          {/* History Log */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm mb-3">
              <History className="w-4 h-4 text-slate-500" />
              <span>Historial de Giros</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs text-slate-600 dark:text-zinc-400">
              {history.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2 py-1 border-b border-slate-50 dark:border-zinc-800/40 last:border-0">
                  <span className="font-medium">{item.text}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Reglas de la Pirinola Chalamandra
              </h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
              <p>
                <strong>Objetivo:</strong> Conservar fichas y despojar a los demás jugadores mediante los giros de la pirinola hexagonal tradicional.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                  <strong>PON 1 / PON 2:</strong> Pones 1 o 2 de tus fichas al pozo central.
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <strong>TOMA 1 / TOMA 2:</strong> Tomas 1 o 2 fichas del pozo central.
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                  <strong>TODOS PONEN:</strong> Cada jugador activo coloca 1 ficha al centro.
                </div>
                <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/40">
                  <strong>¡TOMA TODO!:</strong> ¡Te llevas todas las fichas del pozo!
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-zinc-800">
                En el <strong>Modo Chalamandra</strong>, cada cara viene acompañada de un reto social o prenda festiva.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                ¡Entendido, a jugar!
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Winner Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full text-center border-2 border-amber-400 shadow-2xl space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ¡Tenemos un Campeón!
            </h3>
            <p className="text-base text-slate-600 dark:text-zinc-300">
              <span className="font-bold" style={{ color: winner.color }}>
                {winner.name}
              </span>{' '}
              se ha quedado con todas las fichas de la mesa y gana la Chalamandra.
            </p>
            <button
              onClick={handleResetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-sm shadow-lg hover:brightness-110"
            >
              Jugar otra partida
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
