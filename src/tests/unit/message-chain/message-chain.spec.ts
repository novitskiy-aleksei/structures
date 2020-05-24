import { MessageChain } from '../../../lib/message-chain/message-chain';
import { generateArrayForChain, generateChain, generateChainItem, TestChain } from './message-chain.factory';
import { DoublyLinkedList } from '../../../lib/doubly-linked-list/doubly-linked-list';
import { iterationPassAssert } from '../doubly-linked-list/iteration-pass-assert';
import { generateArray, generateList } from '../doubly-linked-list/doubly-linked-list.factory';
import { LoadDirection } from '../../../lib/message-chain/load-direction';

describe('MessageChain', () => {

  describe('Calculating intersection', () => {
    it('should calculate intersection between same chains', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(10);

      const intersection1 = chain1.searchIntersection(chain2);
      const intersection2 = chain2.searchIntersection(chain1);

      expect(intersection1.id).toBe('0');
      expect(intersection1.id).toBe(intersection2.id);
    });

    it('should calculate that chain has no intersection', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(5, i => i + 20);

      const intersection1 = chain1.searchIntersection(chain2);
      const intersection2 = chain2.searchIntersection(chain1);

      expect(intersection1).toBeNull();
      expect(intersection2).toBeNull();
    });

    it('should calculate intersection between chains in tail of first', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(10, i => i + 9);

      const intersection1 = chain1.searchIntersection(chain2);
      const intersection2 = chain2.searchIntersection(chain1);

      expect(intersection1.id).toBe('9');
      expect(intersection1.id).toBe(intersection2.id);
    });

    it('should calculate intersection between chains in the head of first', () => {
      const chain1 = generateChain(10);
      const chain2 = new TestChain(generateArrayForChain(10, i => i * -1).reverse());

      const intersection1 = chain1.searchIntersection(chain2);
      const intersection2 = chain2.searchIntersection(chain1);

      expect(intersection1.id).toBe('0');
      expect(intersection1.id).toBe(intersection2.id);
    });

    it('should calculate intersection between chains in the middle of first', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(5, i => i + 5);

      const intersection1 = chain1.searchIntersection(chain2);
      const intersection2 = chain2.searchIntersection(chain1);

      expect(intersection1.id).toBe('5');
      expect(intersection2.id).toBe('9');
    });
  });

  describe('Calculate merging direction', () => {
    it('should calculate direction between same chains', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(10);

      const intersection1 = chain1.searchIntersection(chain2);
      const direction1 = chain1.getAttachDirection(intersection1.id, chain2);
      const intersection2 = chain2.searchIntersection(chain1);
      const direction2 = chain2.getAttachDirection(intersection1.id, chain1);

      expect(intersection1.id).toBe('0');
      expect(intersection1.id).toBe(intersection2.id);
      expect(direction1).toBe(LoadDirection.up);
      expect(direction1).toBe(direction2);
    });

    it('should calculate direction for chain which continues existing one', () => {
      const chain1 = generateChain(10);
      const chain2 = generateChain(10, i => i + 9);

      const intersection1 = chain1.searchIntersection(chain2);
      const direction1 = chain1.getAttachDirection(intersection1.id, chain2);
      const intersection2 = chain2.searchIntersection(chain1);
      const direction2 = chain2.getAttachDirection(intersection2.id, chain1);

      expect(direction1).toBe(LoadDirection.up);
      expect(direction2).toBe(LoadDirection.down);
    });

    it('should calculate direction for chain which prepends existing one', () => {
      const chain1 = generateChain(10);
      const chain2 = new TestChain(generateArrayForChain(10, i => i * -1).reverse());

      const intersection1 = chain1.searchIntersection(chain2);
      const direction1 = chain1.getAttachDirection(intersection1.id, chain2);
      const intersection2 = chain2.searchIntersection(chain1);
      const direction2 = chain2.getAttachDirection(intersection2.id, chain1);

      expect(direction1).toBe(LoadDirection.down);
      expect(direction2).toBe(LoadDirection.up);
    });
  });

  describe('Consuming another chain', () => {

    let iterationPassTest: {
      list: DoublyLinkedList,
      cast: number[],
    };

    afterEach(() => {
      if (iterationPassTest?.list) {
        iterationPassAssert(iterationPassTest.list, iterationPassTest.cast);
        iterationPassTest = null;
      }
    });

    it('must consume chain with no items', () => {
      const chain = generateChain(10);
      const consumableChain = generateChain(0);

      chain.consume(consumableChain);

      expect(chain.length).toBe(10);
    });

    it('must consume and attach to head and down', () => {
      const chain = generateChain(10);
      const arr = generateArrayForChain(5)
        .map(v => {
          v.value.id = String(parseInt(v.value.id, 10) * -1);
          v.value.created *= -1;
          return v;
        })
        .reverse()
      ;
      const consumable = new TestChain(arr);

      chain.consume(consumable);

      expect(chain.length).toBe(14);
      expect(chain.head.id).toBe('-4');
      expect(chain.tail.id).toBe('9');

      iterationPassTest = {list: chain, cast: [...arr.map(v => parseInt(v.id, 10)), ...generateArray(10).slice(1)]};
    });

    it('must consume and attach to tail and up', () => {
      const chain = generateChain(10);
      const arr = generateArrayForChain(10).map(v => {
        v.value.id = String(parseInt(v.value.id, 10) + 9);
        v.value.created += 9;
        return v;
      });
      const consumable = new TestChain(arr);

      chain.consume(consumable);

      expect(chain.length).toBe(19);
      expect(chain.head.id).toBe('0');
      expect(chain.tail.id).toBe('18');
      iterationPassTest = {list: chain, cast: generateArray(19)};
    });

    it('must consume and overwrite existing items in the middle', () => {
      const chain = generateChain(10);
      const arr = generateArrayForChain(7).map(v => {
        v.value.id = String(parseInt(v.value.id, 10) + 5);
        v.value.created += 9;
        v.value.payload = 555;
        return v;
      });
      const consumable = new TestChain(arr);

      chain.consume(consumable);

      expect(chain.length).toBe(12);
      expect(chain.head.id).toBe('0');
      expect(chain.tail.id).toBe('11');
      let updItem = chain.getBy('5');
      while (updItem) {
        expect(updItem.value.payload).toBe(555);
        updItem = updItem.next;
      }
      iterationPassTest = {list: chain, cast: generateArray(12)};
    });

    it('must consume chain with no intersection and skip it', () => {
      const chain = generateChain(5);
      const arr = generateArrayForChain(5).map(v => {
        v.value.id = String(parseInt(v.value.id, 10) + 15);
        v.value.created += 19;
        v.value.payload = 555;
        return v;
      });
      const consumable = new TestChain(arr);

      expect(() => chain.consume(consumable)).toThrow();

      expect(chain.length).toBe(5);
    });
  });

});
