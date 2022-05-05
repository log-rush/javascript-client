import { LogRushStream } from './stream';
import { LogRushClientOptions } from './types';

export class LogRushClient {
  private streams: Record<string, LogRushStream>;

  constructor(private options: LogRushClientOptions) {
    this.streams = {};
  }

  public async createStream(): Promise<LogRushStream> {}

  public async deleteStream(id: string): Promise<void> {}

  public disconnect() {}
}
