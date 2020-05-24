import { generateChain, generateChainItem } from './message-chain.factory';

describe('Item freshness control decorator', () => {

  it('should not prepend new item with same id if it was created earlier', () => {
    const chain = generateChain(3);
    const oldItem = generateChainItem('0', 333, -1);

    chain.prepend(oldItem);

    expect(chain.length).toBe(3);
    expect(chain.head.id).toBe('0');
    expect(chain.head.value.payload).toBe(333);
  });

  it('should not append new item with same id if it was created earlier', () => {
    const chain = generateChain(1);
    const oldItem = generateChainItem('0', 111, -1);

    chain.append(oldItem);

    expect(chain.length).toBe(1);
    expect(chain.head.id).toBe('0');
    expect(chain.tail.id).toBe('0');
    expect(chain.tail.value.payload).toBe(111);
  });

  it('should not insertPrevTo item with same id if it was created earlier', () => {
    const chain = generateChain(10);
    const oldItem = generateChainItem('7', 777, 1, 1);

    chain.insertPrevTo('8', oldItem);

    expect(chain.length).toBe(10);
    expect(chain.getBy('7').value.payload).toBe(7);
  });

  it('should not insertNextTo item with same id if it was created earlier', () => {
    const chain = generateChain(10);
    const oldItem = generateChainItem('9', 999, 3, 3);

    chain.insertNextTo('8', oldItem);

    expect(chain.length).toBe(10);
    expect(chain.getBy('9').value.payload).toBe(9);
  });

  it('should insertNextTo and overwrite item with same id', () => {
    const chain = generateChain(10);
    const newItem = generateChainItem('9', 999, 99);

    chain.insertNextTo('8', newItem);

    expect(chain.length).toBe(10);
    expect(chain.getBy('9').value.payload).toBe(999);
  });

  it('should insertPrevTo and overwrite item with same id', () => {
    const chain = generateChain(10);
    const newItem = generateChainItem('3', 333, 33);

    chain.insertPrevTo('4', newItem);

    expect(chain.length).toBe(10);
    expect(chain.getBy('3').value.payload).toBe(333);
  });
});
