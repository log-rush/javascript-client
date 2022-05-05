import { LogRushStream } from './stream';
import { LogRushClientOptions } from './types';

export class LogRushClient {
  private streams: Record<string, LogRushStream>;

  constructor(private options: LogRushClientOptions) {
    this.streams = {};
  }

  public async createStream(name: string): Promise<LogRushStream> {
    return await this.instantiateStream(name, undefined, undefined);
  }

  public async resumeStream(name: string, id: string, key?: string): Promise<LogRushStream> {
    return await this.instantiateStream(name, id, key);
  }

  private async instantiateStream(name: string, id?: string, key?: string): Promise<LogRushStream> {
    const stream = new LogRushStream(this.options, name, id, key);
    await stream.register();
    this.streams[stream.id] = stream;
    return stream;
  }

  public async deleteStream(id: string): Promise<void> {
    const stream = this.streams[id];
    if (!stream) return;
    const response = await stream.destroy();
    if ('message' in response && response.message) {
      console.error(response.message);
    } else {
      delete this.streams[stream.id];
    }
  }

  public async disconnect(): Promise<void> {
    await Promise.all(Object.values(this.streams).map(stream => this.deleteStream(stream.id)));
  }
}
