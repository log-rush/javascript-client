export class BatchQueue<T> {
  private queue: T[];

  constructor(public readonly maxSize: number, private readonly overflowHandler: (items: T[]) => Promise<void>) {}

  public push(item: T) {}

  public async forceExecute() {}

  public clear() {}
}
