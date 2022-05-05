import { LogRushStream } from './stream';
import { LogRushClientOptions } from './types';

/**
 * LogRushClient
 *
 * a utility class for creating log streams with an ease
 *
 * @export
 * @class LogRushClient
 */
export class LogRushClient {
  /**
   * a map holding all active streams for an data source
   *
   * @private
   * @type {Record<string, LogRushStream>}
   * @memberof LogRushClient
   */
  private streams: Record<string, LogRushStream>;

  /**
   * LogRushClientOptions constructor
   * @param {LogRushClientOptions} options basic configuration options
   * @memberof LogRushClient
   */
  constructor(private options: LogRushClientOptions) {
    this.streams = {};
  }

  /**
   * create a new log stream
   *
   * @async
   * @param {string} name the log streams name
   * @return {Promise<LogRushStream>}  Promise<LogRushStream>
   * @memberof LogRushClient
   */
  public async createStream(name: string): Promise<LogRushStream> {
    return await this.instantiateStream(name, undefined, undefined);
  }

  /**
   * creates or resumes a log stream with the given id
   *
   * @async
   * @param {string} name the log streams name
   * @param {string} id the id of the log stream
   * @param {string} [key] the log streams secret key
   * @return {Promise<LogRushStream>}  Promise<LogRushStream>
   * @memberof LogRushClient
   */
  public async resumeStream(name: string, id: string, key?: string): Promise<LogRushStream> {
    return await this.instantiateStream(name, id, key);
  }

  /**
   * private utility function for creating log streams
   *
   * @async
   * @private
   * @param {string} name the log streams name
   * @param {string} [id] the log streams id
   * @param {string} [key] the log streams secret key
   * @return {Promise<LogRushStream>}  Promise<LogRushStream>
   * @memberof LogRushClient
   */
  private async instantiateStream(name: string, id?: string, key?: string): Promise<LogRushStream> {
    const stream = new LogRushStream(this.options, name, id, key);
    await stream.register();
    this.streams[stream.id] = stream;
    return stream;
  }

  /**
   * delete an existing log stream
   *
   * @async
   * @param {string} id the id of the log stream to delete
   * @return {Promise<void>}  Promise<void>
   * @memberof LogRushClient
   */
  public async deleteStream(id: string): Promise<void> {
    const stream = this.streams[id];
    if (!stream) return;
    const response = await stream.destroy();
    if (response && 'message' in response && response.message) {
      console.error(response.message);
    } else {
      delete this.streams[stream.id];
    }
  }

  /**
   * delete all log streams registered wth this client
   *
   * @async
   * @return {Promise<void>}  Promise<void>
   * @memberof LogRushClient
   */
  public async disconnect(): Promise<void> {
    await Promise.all(Object.values(this.streams).map(stream => this.deleteStream(stream.id)));
  }
}
