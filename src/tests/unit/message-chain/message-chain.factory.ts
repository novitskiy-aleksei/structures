import { MessageChainValue } from '../../../lib/message-chain/message-chain-value';
import { MessageChain } from '../../../lib/message-chain/message-chain';
import { MessageChainElement } from '../../../lib/message-chain/message-chain.element';
import { LoadDirection } from '../../../lib/message-chain/load-direction';

export class TestMessage implements MessageChainValue<string> {
  id: string;
  unSynced?: boolean;
  updated: number;
  created: number;
  payload: number;
}

export class TestChain extends MessageChain<string, TestMessage> {
  public searchIntersection(update: this): MessageChainElement<string, TestMessage> | null {
    return super.searchIntersection(update);
  }

  public getAttachDirection(intersectionId: string, update: this): LoadDirection {
    return super.getAttachDirection(intersectionId, update);
  }
}

export function generateArrayForChain(length: number, idGenerator?: (i: number) => number) {
  return new Array(length)
    .fill(0)
    .map((_, i) => new MessageChainElement<string, TestMessage>({
      id: String(idGenerator ? idGenerator(i) : i),
      updated: i,
      payload: i,
      created: i,
    }));
}

export function generateChain(length: number, idGenerator?: (i: number) => number) {
  return new TestChain(generateArrayForChain(length, idGenerator));
}

export function generateChainItem(id: string, payload: number, updated = new Date().getTime(), created = new Date().getTime()) {
  return new MessageChainElement<string, TestMessage>({id, updated, created, payload});
}
