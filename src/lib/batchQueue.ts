export class BatchQueue<T> {
  private queue: T[];

  constructor(public readonly maxSize: number, private readonly overflowHandler: (items: T[]) => void) {}

  public push(item: T) {}

  public forceExecute() {}

  public clear() {}
}
