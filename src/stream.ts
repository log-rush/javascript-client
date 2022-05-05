import { LogRushHttpApi } from './http';
import { BatchQueue } from './lib/batchQueue';
import { LogRushApiErrorResponse, LogRushClientOptions, LogRushLog } from './types';

export class LogRushStream {
  private logsQueue: BatchQueue<LogRushLog>;

  get id(): string {
    return this.streamId;
  }

  get secretKey(): string {
    return this.secretKey;
  }

  constructor(
    private options: LogRushClientOptions,
    public readonly name: string,
    private streamId: string = '',
    private streamKey: string = ''
  ) {
    this.logsQueue = new BatchQueue(this.options.batchSize ?? 1, logs => this.sendLogs(logs));
  }

  public async register(): Promise<LogRushApiErrorResponse | undefined> {
    try {
      const stream = await LogRushHttpApi.registerStream(this.options.dataSourceUrl, this.streamId, this.streamKey);
      this.streamId = stream.id;
      this.streamKey = stream.secretKey;
      return undefined;
    } catch (e: any) {
      return {
        message: e.toString(),
      };
    }
  }

  public log(msg: string) {
    this.logsQueue.push({
      log: msg,
      timestamp: Date.now(),
    });
  }

  private async sendLogs(logs: LogRushLog[]) {
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
