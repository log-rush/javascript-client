import { isBrowser } from './lib/isBrowser';
import { LogRushStream } from './stream';
import { LogRushClientOptions } from './types';

if (!isBrowser()) {
  await import('isomorphic-fetch');
}

export { LogRushClient } from './client';
export { LogRushStream } from './stream';

export async function createLogStream(
  options: LogRushClientOptions,
  name: string,
  id?: string,
  key?: string
): Promise<LogRushStream> {
  const stream = new LogRushStream(options, name, id, key);
  await stream.register();
  return stream;
}
