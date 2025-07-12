export const debugApi = {
    error: (...args: any[]) => {
      if (import.meta.env.DEV) console.error('[API]', ...args);
    },
    warn: (...args: any[]) => {
      if (import.meta.env.DEV) console.warn('[API]', ...args);
    },
    log: (...args: any[]) => {
      if (import.meta.env.DEV) console.log('[API]', ...args);
    },
    info: (...args: any[]) => {
      if (import.meta.env.DEV) console.info('[API]', ...args);
    },
  };