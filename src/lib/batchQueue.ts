/**
 * BatchQueue
 *
 * a utility class for batching a constant stream
 * of incoming items into fixed sized batches
 *
 * @export
 * @class BatchQueue
 * @template T the item type
 */
export class BatchQueue<T> {
  /**
   * the queue of application logs
   *
   * @private
   * @type {T[]}
   * @memberof BatchQueue
   */
  private queue: T[];

  /**
   * BatchQueue constructor
   * @param {number} maxSize maximum batch size
   * @param {(items: T[]) => Promise<void>} overflowHandler event handler that gets called when the maximum batch size is reached
   * @memberof BatchQueue
   */
  constructor(public readonly maxSize: number, private readonly overflowHandler: (items: T[]) => Promise<void>) {
    this.queue = [];
  }

  /**
   * push a new item into the current batch
   *
   * @param {T} item the item the push
   * @return {void} void
   * @memberof BatchQueue
   */
  public push(item: T): void {
    this.queue.push(item);
    if (this.queue.length >= this.maxSize) {
      this.forceExecute();
    }
  }

  /**
   * execute the handler when a batch is full
   *
   * @async
   * @return {Promise<void>} Promise<void>
   * @memberof BatchQueue
   */
  public async forceExecute(): Promise<void> {
    const batchedItems = [...this.queue];
    this.queue = [];
    await this.overflowHandler(batchedItems);
  }

  /**
   * clear the current batch
   *
   * @return {void} void
   * @memberof BatchQueue
   */
  public clear(): void {
    this.queue = [];
  }
}
