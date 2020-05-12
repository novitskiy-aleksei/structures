import { generateChain, generateChainItem } from './message-chain.factory';

describe('Check limit control of message chain', () => {

  beforeEach(() => {
  });
  //
  // it('should crop chain if current length overflow new limit', () => {
  //   const chain = generateChain(10);
  //
  //   expect(chain.length).toBe(10);
  //   chain.setLimit(6);
  //
  //   expect(chain.length).toBe(6);
  //   expect(chain.tail.id).toEqual(chain.getBy('5').id);
  // });
  //
  // it('should shift to respect chain limit when append', () => {
  //   const chain = generateChain(10);
  //   const newItem = generateChainItem('11', 11);
  //
  //   chain.setLimit(10);
  //   chain.append(newItem.value.id, newItem);
  //
  //   expect(chain.length).toBe(10);
  //   expect(chain.head.value.id).toBe('1');
  //   expect(chain.tail.value.id).toBe(newItem.value.id);
  // });
  //
  // it('should shift to respect chain limit when prepend', () => {
  //   const chain = generateChain(10);
  //   const newItem = generateChainItem('-1', -1);
  //
  //   chain.setLimit(10);
  //   chain.prepend(newItem.value.id, newItem);
  //
  //   expect(chain.length).toBe(10);
  //   expect(chain.head).toEqual(newItem);
  //   expect(chain.tail.value.id).toBe('8');
  // });



  // it('should consume new chain and not overflow limit', () => {
  //   const chain = generateChain(10);
  //   const supplyChain = generateChain(8);
  //
  //   chain.setLimit(13);
  //   chain.consume(supplyChain);
  //
  //   expect(chain.length).toBe(13);

    // // head -> tail
    // let item = chain.head;
    // const headOldItemPos = newChainLength - 1;
    // // existed
    // for (let i = headOldItemPos; i < messageMockCount - newChainLength + headOldItemPos; i++) {
    //   expect(item.value.id).toBe(messageMocks[i].id);
    //   item = item.next;
    // }
    // // inserted
    // for (let i = 0; i < newChainLength; i++) {
    //   expect(item.value.id).toBe(newChainMocks[i].id);
    //   item = item.next;
    // }
    //
    // expect(chain.getHead().id).toBe('msg_id_9');
    // expect(chain.getTail().id).toBe(newChainMocks[newChainLength - 1].id);
  // });

});
