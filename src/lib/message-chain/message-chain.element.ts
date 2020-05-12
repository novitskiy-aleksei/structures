import { LinkedListItem } from '../doubly-linked-list/linked-list-item';
import { ChainLoadRequest } from './chain-load-request';
import { RetrieveDirection } from './retrieve-direction';
import { LinkedListValue } from '../doubly-linked-list/linked-list-value';

export class MessageChainElement<ChainId, ChainValue extends LinkedListValue<ChainId>> extends LinkedListItem<ChainId, ChainValue> {

  getLoadInfo(): Partial<ChainLoadRequest> {
    if (!this.prev) {
      return {direction: RetrieveDirection.down, from: this.value.id};
    }
    if (!this.next) {
      return {direction: RetrieveDirection.up, from: this.value.id};
    }
  }

}
