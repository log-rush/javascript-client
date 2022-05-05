import { LogRushStream } from './stream';
import { LogRushApiErrorResponse, LogRushApiSuccessResponse, LogRushLog } from './types';

/**
 * LogRushHttpApi
 *
 * an utility object containing all http calls for calling the log-rush api
 *
 * @export
 * @constant
 * @global
 */
export const LogRushHttpApi = {
  async registerStream(url: string, name: string, id?: string, key?: string): Promise<LogRushStream> {
    const req = await fetch(`${url}stream/register`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: name,
        id: id ?? '',
        key: key ?? '',
      }),
    });

    if (req.status !== 200) {
      throw new Error('cant register log stream: ' + JSON.stringify(await req.json()));
    }

    return (await req.json()) as LogRushStream;
  },
  async unregisterStream(
    url: string,
    id?: string,
    key?: string
  ): Promise<LogRushApiErrorResponse | LogRushApiSuccessResponse> {
    const req = await fetch(`${url}stream/unregister`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id ?? '',
        key: key ?? '',
      }),
    });
    return await req.json();
  },
  async log(
    url: string,
    logStream: string,
    log: LogRushLog
  ): Promise<LogRushApiErrorResponse | LogRushApiSuccessResponse> {
    const req = await fetch(`${url}log`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: logStream,
        log: log.log,
        timestamp: log.timestamp,
      }),
    });

    if (req.status !== 200) {
      return {
        message: 'cant log to stream ' + logStream + ' : ' + JSON.stringify(await req.json()),
      };
    }

    return (await req.json()) as LogRushApiErrorResponse | LogRushApiSuccessResponse;
  },
  async batch(
    url: string,
    logStream: string,
    logs: LogRushLog[]
  ): Promise<LogRushApiErrorResponse | LogRushApiSuccessResponse> {
    const req = await fetch(`${url}batch`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: logStream,
        logs: logs.map(log => ({
          log: log.log,
          timestamp: log.timestamp,
        })),
      }),
    });

    if (req.status !== 200) {
      return {
        message: 'cant log to stream ' + logStream + ' : ' + JSON.stringify(await req.json()),
      };
    }

    return (await req.json()) as LogRushApiErrorResponse | LogRushApiSuccessResponse;
  },
};
