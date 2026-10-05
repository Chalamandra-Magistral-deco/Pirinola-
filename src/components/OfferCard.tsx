import { ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const stripeUrl = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
const kofiUrl = import.meta.env.VITE_KOFI_URL;
const bmacUrl = import.meta.env.VITE_BMAC_URL;

export function OfferCard() {
  return (
    <article className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
            <GraduationCap className="h-4 w-4" /> Kit educativo
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">Kit Aprende Redes Neuronales con Pirinola</h2>
          <p className="mt-3 text-zinc-300">Convierte la experiencia interactiva en una secuencia didáctica reutilizable: guía, ejercicios, retos y material para clase.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Compra segura mediante proveedor externo</span>
            <span>Acceso digital</span>
            <span>Para estudiantes y docentes</span>
          </div>
        </div>
        <div className="w-full lg:w-auto lg:min-w-64">
          {stripeUrl ? (
            <a
              href={stripeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('checkout_click')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 font-black text-zinc-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Comprar el Kit <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-950/60 px-5 py-4 text-sm text-zinc-300">
              <strong className="text-white">Oferta lista para activar.</strong>
              <p className="mt-1 text-xs text-zinc-500">Configura VITE_STRIPE_PAYMENT_LINK en Vercel para habilitar el checkout.</p>
            </div>
          )}
          {(kofiUrl || bmacUrl) && (
            <div className="mt-3 flex gap-2">
              {kofiUrl && <a href={kofiUrl} target="_blank" rel="noreferrer" className="flex-1 text-center rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-500">Ko-fi</a>}
              {bmacUrl && <a href={bmacUrl} target="_blank" rel="noreferrer" className="flex-1 text-center rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-500">Buy Me a Coffee</a>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
