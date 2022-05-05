import { LogRushHttpApi } from './http';
import { BatchQueue } from './lib/batchQueue';
import { LogRushApiErrorResponse, LogRushClientOptions, LogRushLog } from './types';

/**
 * LogRushStream
 *
 * A class implementing a log-rush log stream.
 *
 * @export
 * @class LogRushStream
 */
export class LogRushStream {
  /**
   * internal queue of application logs
   *
   * @private
   * @type {BatchQueue<LogRushLog>}
   * @memberof LogRushStream
   */
  private logsQueue: BatchQueue<LogRushLog>;

  /**
   * the streamss id
   *
   * @readonly
   * @type {string}
   * @memberof LogRushStream
   */
  get id(): string {
    return this.streamId;
  }

  /**
   * the streams secret key
   *
   * it is needed for unregistering/resuming the log stream
   *
   * @readonly
   * @type {string}
   * @memberof LogRushStream
   */
  get secretKey(): string {
    return this.streamKey;
  }

  /**
   * LogRushStream constructor
   * @param {LogRushClientOptions} options basic configuration options
   * @param {string} name the log streams name
   * @param {string} [id] the id of the stream (optional, only needed for resuming)
   * @param {string} [key] the secret key of the stream
   */
  constructor(
    private options: LogRushClientOptions,
    public readonly name: string,
    private streamId: string = '',
    private streamKey: string = ''
  ) {
    this.logsQueue = new BatchQueue(this.options.batchSize ?? 1, logs => this.sendLogs(logs));
  }

  /**
   * register the log stream on the data source specified in the options
   *
   * @async
   * @return {Promise<LogRushApiErrorResponse | undefined>}  Promise<LogRushApiErrorResponse | undefined>
   * @memberof LogRushStream
   */
  public async register(): Promise<LogRushApiErrorResponse | undefined> {
    try {
      const stream = await LogRushHttpApi.registerStream(
        this.options.dataSourceUrl,
        this.name,
        this.streamId,
        this.streamKey
      );
      this.streamId = stream.id;
      this.streamKey = stream.secretKey;
      return undefined;
    } catch (e: any) {
      return {
        message: e.toString(),
      };
    }
  }

  /**
   * push a log to the data source
   *
   * @param {string} msg the log message
   * @return {void} void
   * @memberof LogRushStream
   */
  public log(msg: string): void {
    this.logsQueue.push({
      log: msg,
      timestamp: Date.now(),
    });
  }

  /**
   * logsQueue bath size exceeded handler
   *
   * pushed the log to the data source when the maximum batch size is reached
   *
   * @async
   * @param {LogRushLog[]} logs
   * @return {Promise<void>} Promise<void>
   * @memberof LogRushStream
   */
  private async sendLogs(logs: LogRushLog[]): Promise<void> {
    if (logs.length === 1) {
      const response = await LogRushHttpApi.log(this.options.dataSourceUrl, this.streamId, logs[0]);
      if ('message' in response && response.message) {
        console.error(response.message);
      }
    } else {
      const response = await LogRushHttpApi.batch(this.options.dataSourceUrl, this.streamId, logs);
      if ('message' in response && response.message) {
        console.error(response.message);
      }
    }
  }

  /**
   * unregister the log stream from the data source / closing it
   *
   * @async
   * @param {boolean} [sendRemainingLogs=false] a boolean whether to send remaining logs in the current batch
   * @return {Promise<LogRushApiErrorResponse | undefined>}  Promise<LogRushApiErrorResponse | undefined>
   * @memberof LogRushStream
   */
  public async destroy(sendRemainingLogs: boolean = false): Promise<LogRushApiErrorResponse | undefined> {
    if (sendRemainingLogs) {
      await this.logsQueue.forceExecute();
    } else {
      this.logsQueue.clear();
    }

    const response = await LogRushHttpApi.unregisterStream(this.options.dataSourceUrl, this.streamId, this.streamKey);
    if ('success' in response && response.success) {
      return undefined;
    }
    return response as LogRushApiErrorResponse;
  }
}
