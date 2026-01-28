interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_WEATHER_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
