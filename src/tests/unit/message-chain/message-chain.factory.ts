import { MessageChainValue } from '../../../lib/message-chain/message-chain-value';
import { MessageChain } from '../../../lib/message-chain/message-chain';
import { MessageChainElement } from '../../../lib/message-chain/message-chain.element';

export class TestMessage implements MessageChainValue<string> {
  id: string;
  unSynced?: boolean;
  updated: number;

  payload: number;
}

export class TestChain extends MessageChain<string, TestMessage> {
}

export function generateChain(length: number) {
  const arrayArray = new Array(length)
    .fill(0)
    .map((_, i) => new MessageChainElement<string, TestMessage>({
      id: String(i),
      updated: i,
      payload: i,
    }));

  return new TestChain(arrayArray);
}

export function generateChainItem(id: string, payload: number, updated = new Date().getTime()) {
  return new MessageChainElement<string, TestMessage>({id, updated, payload});
}
