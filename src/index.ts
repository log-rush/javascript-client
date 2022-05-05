import { isBrowser } from './lib/isBrowser';
import { LogRushStream } from './stream';

if (!isBrowser()) {
  await import('isomorphic-fetch');
}

export { LogRushClient } from './client';
export { LogRushStream } from './stream';

export async function createStream(name: string, id?: string, key?: string): Promise<LogRushStream> {
  const stream = new LogRushStream(this.options, name, id, key);
  await stream.register();
  this.streams[stream.id] = stream;
  return stream;
}
