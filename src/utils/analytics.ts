export type AnalyticsEvent =
  | 'spin_start'
  | 'offer_view'
  | 'checkout_click'
  | 'support_click';

export function trackEvent(name: AnalyticsEvent, properties: Record<string, string | number> = {}) {
  const payload = { name, ...properties, timestamp: Date.now() };

  if (typeof window !== 'undefined') {
    const w = window as Window & { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('pirinola:analytics', { detail: payload }));
  }

  if (import.meta.env.DEV) console.debug('[analytics]', payload);
}
