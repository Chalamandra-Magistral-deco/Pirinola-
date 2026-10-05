import React from 'react';
import { SAMPLE_FRUITS, FruitSample } from '../types/neural';
import { Apple } from 'lucide-react';

interface FruitTesterProps {
  selectedFruit: FruitSample;
  onSelectFruit: (fruit: FruitSample) => void;
}

export const FruitTester: React.FC<FruitTesterProps> = ({
  selectedFruit,
  onSelectFruit,
}) => {
  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Apple className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base tracking-tight">
            Banco de Muestras: Frutas para la Red
          </h3>
        </div>
        <span className="text-xs text-zinc-400">
          Elige una fruta para evaluar
        </span>
      </div>

      {/* Fruit Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {SAMPLE_FRUITS.map((fruit) => {
          const isSelected = selectedFruit.id === fruit.id;
          return (
            <button
              key={fruit.id}
              onClick={() => onSelectFruit(fruit)}
              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/20 shadow-md ring-2 ring-amber-400/40'
                  : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <div className="text-3xl transform hover:scale-110 transition-transform">
                {fruit.emoji}
              </div>
              <div className="text-xs font-bold leading-tight truncate w-full">
                {fruit.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {fruit.expectedOutput}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Fruit Feature Card */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{selectedFruit.emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-white">{selectedFruit.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {selectedFruit.colorName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{selectedFruit.description}</p>
          </div>
        </div>

        {/* Feature metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Color</span>
            <span className="font-bold text-red-400">{(selectedFruit.colorVal * 100).toFixed(0)}%</span>
          </div>

          <div className="text-center px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Tamaño</span>
            <span className="font-bold text-amber-400">{(selectedFruit.sizeVal * 15).toFixed(1)} cm</span>
          </div>

          <div className="text-center px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Dulzura</span>
            <span className="font-bold text-emerald-400">{(selectedFruit.sweetnessVal * 18).toFixed(1)}°Bx</span>
          </div>
        </div>
      </div>
    </div>
  );
};
