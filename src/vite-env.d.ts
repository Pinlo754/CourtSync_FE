/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_Backend_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 