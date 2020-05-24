import { LinkedListItem } from '../doubly-linked-list/linked-list-item';
import { ChainLoadRequest } from './chain-load-request';
import { LoadDirection } from './load-direction';
import { LinkedListValue } from '../doubly-linked-list/linked-list-value';

/**
 * MessageChain node which represents one element in chain
 * @public
 */
export class MessageChainElement<ChainId, ChainValue extends LinkedListValue<ChainId>> extends LinkedListItem<ChainId, ChainValue> {

  getLoadInfo(): Partial<ChainLoadRequest<ChainId>> {
    if (!this.prev && this.next) {
      return {direction: LoadDirection.down, from: this.next.value.id};
    }
    if (!this.next && this.prev) {
      return {direction: LoadDirection.up, from: this.prev.value.id};
    }
  }

}
