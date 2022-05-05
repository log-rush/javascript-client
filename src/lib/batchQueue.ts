export class BatchQueue<T> {
  private queue: T[];

  constructor(public readonly maxSize: number, private readonly overflowHandler: (items: T[]) => Promise<void>) {
    this.queue = [];
  }

  public push(item: T) {
    this.queue.push(item);
    if (this.queue.length >= this.maxSize) {
      this.forceExecute();
    }
  }

  public async forceExecute() {
    await this.overflowHandler([...this.queue]);
    this.queue = [];
  }

  public clear() {
    this.queue = [];
  }
}
