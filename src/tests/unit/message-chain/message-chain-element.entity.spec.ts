import { generateChain, generateChainItem, TestMessage } from './message-chain.factory';

describe('MessageChainElementEntity', () => {

  it('should provide info for load up', () => {
    const chain = generateChain(10);

    expect(chain.tail.getLoadInfo()).toEqual({ direction: 1, from: '8' });
    expect(chain.head.getLoadInfo()).toEqual({ direction: 2, from: '1' });
  });

});
