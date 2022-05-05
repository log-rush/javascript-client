import { isBrowser } from './lib/isBrowser';
import { LogRushStream } from './stream';
import { LogRushClientOptions } from './types';

if (!isBrowser()) {
  (async () => {
    // @ts-ignore
    await import('isomorphic-fetch');
  })();
}

export { LogRushClient } from './client';
export { LogRushStream } from './stream';

/**
 * instantiate a new LogRushStream instance
 *
 * @export
 * @param {LogRushClientOptions} options basic configuration options
 * @param {string} name the log streams name
 * @param {string} [id] the id of the stream (optional, only needed for resuming)
 * @param {string} [key] the secret key of the stream
 * @return {Promise<LogRushStream>}  Promise<LogRushStream>
 */
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
