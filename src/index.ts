import { isBrowser } from './lib/isBrowser';

if (!isBrowser()) {
  await import('isomorphic-fetch');
}

export { LogRushClient } from './client';
