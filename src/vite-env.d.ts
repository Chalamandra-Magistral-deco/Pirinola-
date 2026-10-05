/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_STRIPE_PAYMENT_LINK?: string;
  readonly VITE_KOFI_URL?: string;
  readonly VITE_BMAC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
