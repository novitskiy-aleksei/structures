import { DoublyLinkedList } from '../doubly-linked-list/doubly-linked-list';
import { MessageChainElement } from './message-chain.element';
import { ChainLoadRequest } from './chain-load-request';
import { ChainLimitControl } from './chain-limit-control.decorator';
import { LoadDirection } from './load-direction';
import { MessageChainValue } from './message-chain-value';
import { ItemFreshnessControl } from './item-freshness-control.decorator';

/**
 * Message chain is a data structure which is based on doubly linked list
 * extending it with abilities to consume another chains of any sizes and updates
 * existing items, methods for dynamically loading it parts, syncing, controlling length
 * and managing shifted nodes which is viable for building messaging feed
 *
 * @public
 */
export class MessageChain<ChainId, ChainValue extends MessageChainValue<ChainId>> extends DoublyLinkedList<ChainId, ChainValue, MessageChainElement<ChainId, ChainValue>> {

  /**
   * Indicates current max size of current chain
   * Equals null - means no limit control
   */
  private chainLimit: number = null;

  /**
   * Apply updates for current chain from provided
   *
   * Inserts new elements and updates current chain items
   * with same items in update with greater timestamp
   *
   * @example
   * ```typescript
   * const result = currentChain.consume(updateChain);
   * ```
   *
   * ```
   * | Current chain | Update chain | Result         |
   * |---------------|--------------|----------------|
   * | 0,1,2         | -3,-2,-1,0   | -3,-2,-1,0,1,2 |
   * | 0,1,2         | 0,1,2        | 0,1,2          |
   * | 0,1,2         | 2,3,4        | 0,1,2,3,4      |
   * | 0,1,2,3       | 2,3,4        | 0,1,2,3,4      |
   * | 0,1,2,3       | 1,2          | 0,1,2,3        |
   * | 0,1,2,3       | 1,2,22       | 0,1,2,22,3     |
   *```
   * @param update - Consumable chain which used to update current
   * @param loadRequest - If update was requested by ChainLoadRequest,
   * then you can provide it to help recognize how to apply 'update' chain
   */
  consume(update: this, loadRequest?: ChainLoadRequest<ChainId>): this {
    if (update.length === 0) {
      if (update.head === undefined) {
        this.head.markAsBegin();
      }
      if (update.tail === undefined) {
        this.tail.markAsEnd();
      }

      return this;
    }

    // if no load request provided - we try to calculate it
    if (!loadRequest) {
      const link = this.searchIntersection(update);
      if (!link) {
        throw new Error('No intersection found for chain ' + update.log());
      }

      const direction = this.getAttachDirection(link.id, update);
      loadRequest = {from: link.id, direction};
    }

    return this.upsert(update, loadRequest);
  }

  /**
   * Set maximum amount of items which current chain can contain
   *
   * @param newLimit - new maximum size of current chain
   */
  setLimit(newLimit: number): this {
    this.chainLimit = newLimit;

    if (this.length > newLimit) {
      let item = this.tail;
      let overflow = this.length - newLimit;
      while (overflow > 0) {
        this.remove(item.value.id);
        overflow--;
        item = this.tail;
      }
    }

    return this;
  }

  @ChainLimitControl()
  @ItemFreshnessControl()
  prepend(newItem: MessageChainElement<ChainId, ChainValue>): this {
    return super.prepend(newItem);
  }

  @ChainLimitControl()
  @ItemFreshnessControl()
  append(newItem: MessageChainElement<ChainId, ChainValue>): this {
    return super.append(newItem);
  }

  @ChainLimitControl()
  @ItemFreshnessControl()
  insertNextTo(position: ChainId, newItem: MessageChainElement<ChainId, ChainValue>): this {
    return super.insertNextTo(position, newItem);
  }

  @ChainLimitControl()
  @ItemFreshnessControl()
  insertPrevTo(position: ChainId, newItem: MessageChainElement<ChainId, ChainValue>): this {
    return super.insertPrevTo(position, newItem);
  }

  getBy(key: ChainId): MessageChainElement<ChainId, ChainValue> | undefined {
    return super.getBy(key);
  }

  /**
   * Calculates right attach direction between provided chain and this
   *
   * @param intersectionId - id of first intersection item between update and this
   * @param update - Chain provided to calculate right direction for possible upserting
   */
  protected getAttachDirection(intersectionId: ChainId, update: this): LoadDirection {
    const current = this.getBy(intersectionId);
    const fresh = update.getBy(intersectionId);

    if (current.next?.id === fresh.next?.id) {
      return LoadDirection.up;
    }
    if (current.prev?.id === fresh.prev?.id) {
      return LoadDirection.down;
    }

    if (!current.next && fresh.next) {
      return LoadDirection.up;
    }
    if (current.next.value.updated <= fresh.next?.value.updated) {
      return LoadDirection.up;
    }
    if (!current.prev && fresh.prev) {
      return LoadDirection.down;
    }
    if (current.prev?.value.updated <= fresh.prev.value.updated) {
      return LoadDirection.down;
    }
  }

  /**
   * Calculates intersection item - first element which exists in current and provided chain
   *
   * @param update - Chain provided to calculate intersection with
   * @returns MessageChainElement - First element which exists in current chain and provided
   */
  protected searchIntersection(update: this): MessageChainElement<ChainId, ChainValue> | null {
    if (this.hashTable.has(update.head.id)) {
      return this.getBy(update.head.id);
    }
    if (this.hashTable.has(update.tail.id)) {
      return this.getBy(update.tail.id);
    }

    let intersection: MessageChainElement<ChainId, ChainValue> = null;
    let item = update.head;
    while (item) {
      if (this.hashTable.has(item.id)) {
        intersection = this.getBy(item.id);
        break;
      }

      item = item.prev;
    }

    return intersection;
  }

  /**
   * Insert new items from provided chain or updates existed if it's required
   *
   * @param update - Chain with updated information
   * @param loadRequest - Info how to attach provided chain
   */
  protected upsert(update: this, loadRequest: ChainLoadRequest<ChainId>): this {
    const current = this.getBy(loadRequest.from);
    const fresh = update.getBy(loadRequest.from);

    this.update(fresh);
    let cursor = current.id;
    let item = loadRequest.direction === LoadDirection.up ? fresh.next : fresh.prev;

    while (item) {
      if (loadRequest.direction === LoadDirection.up) {
        this.insertNextTo(cursor, item);
        cursor = item.id;
        item = item.next;
      } else {
        this.insertPrevTo(cursor, item);
        cursor = item.id;
        item = item.prev;
      }
    }

    return this;
  }

}
