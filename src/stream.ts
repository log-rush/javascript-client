import { BatchQueue } from './lib/batchQueue';
import { LogRushClientOptions, LogRushLog } from './types';

export class LogRushStream {
  private logsQueue: BatchQueue<LogRushLog>;

  get id(): string {
    return this.streamId;
  }

  get secretKey(): string {
    return this.secretKey;
  }

  // @internal
  constructor(
    private options: LogRushClientOptions,
    public readonly name: string,
    private streamId: string = '',
    private streamKey: string = ''
  ) {}

  public log(msg: string) {}
}
