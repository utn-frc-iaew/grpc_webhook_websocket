/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string;
  readonly VITE_WS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
