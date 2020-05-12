import { Subject } from 'rxjs';
import { DoublyLinkedList } from '../doubly-linked-list/doubly-linked-list';
import { MessageChainElement } from './message-chain.element';
import { ChainLoadRequest } from './chain-load-request';
import { ChainLimitControl } from './chain-limit-control.decorator';
import { RetrieveDirection } from './retrieve-direction';
import { MessageChainValue } from './message-chain-value';

/**
 * Message chain is a data structure which is based on doubly linked list
 * extending it with abilities to consume another chains of any sizes and updates
 * existing items, methods for dynamically loading it parts, syncing, controlling length
 * and managing shifted nodes which is viable for building messaging feed
 */
export class MessageChain<ChainId, ChainValue extends MessageChainValue<ChainId>> extends DoublyLinkedList<ChainId, MessageChainElement<ChainId, ChainValue>, ChainValue> {

  loadRequests$ = new Subject<ChainLoadRequest>();
  shiftedItem$ = new Subject<MessageChainElement<ChainId, ChainValue>>();

  private chainLimit: number = null;

  @ChainLimitControl()
  prepend(newItem: MessageChainElement<ChainId, ChainValue>) {
    return super.prepend(newItem);
  }

  @ChainLimitControl()
  append(newItem: MessageChainElement<ChainId, ChainValue>) {
    return super.append(newItem);
  }

  @ChainLimitControl()
  insertNextTo(position: ChainId, newItem: MessageChainElement<ChainId, ChainValue>) {
    return super.insertNextTo(position, newItem);
  }

  @ChainLimitControl()
  insertPrevTo(position: ChainId, newItem: MessageChainElement<ChainId, ChainValue>) {
    return super.insertPrevTo(position, newItem);
  }

  getBy(key: ChainId): MessageChainElement<ChainId, ChainValue> | undefined {
    return super.getBy(key);
  }

  log() {
    let str = ':|';
    let item = this.head;
    if (item && item.prev === undefined) {
      str = '[global head] ' + str;
    }
    while (item) {
      str += item.value.id + ' -> ';
      item = item.next;
    }
    if (item === undefined) {
      str += ' [global tail end]';
    }

    return str;
  }

  private searchIntersection(part: this): MessageChainElement<ChainId, ChainValue> {
    let intersection: MessageChainElement<ChainId, ChainValue> = null;
    let item = part.head;

    while (item) {
      intersection = this.hashTable.get(item.value.id);
      if (intersection) {
        break;
      }
      item = item.prev;
    }

    return intersection;
  }


  /**
   * @ChainLimitControl decorator
   */
  private controlLimitOverflow(newItem: MessageChainElement<ChainId, ChainValue>) {

    if (!this.chainLimit || this.length <= this.chainLimit) {
      return null;
    }
    const assimilated = this.hashTable.get(newItem.value.id);

    let prev = assimilated.prev;
    let next = assimilated.next;
    let tailDist = 0;
    let headDist = 0;

    // speed up searching element position if it's on edges
    if ((assimilated === this.tail || assimilated === this.head) && this.length > 1) {
      if (this.tail === assimilated) {
        tailDist = 0;
        headDist = 1;
      } else {
        tailDist = 1;
        headDist = 0;
      }
    } else {
      while (prev || next) {
        if (prev) {
          tailDist++;
          prev = prev.prev;
        }
        if (next) {
          headDist++;
          next = next.next;
        }
      }
    }

    if (tailDist < headDist) {
      this.removeHead();
    } else {
      this.removeTail();
    }
  }
}
