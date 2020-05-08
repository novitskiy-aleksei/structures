import { DoublyLinkedList } from '../../lib/doubly-linked-list/doubly-linked-list';
import { LinkedListItem } from '../../lib/doubly-linked-list/linked-list-item';
import { LinkedListValue } from '../../lib/doubly-linked-list/linked-list-value';

describe('Doubly linked list performance tests', () => {

  it('should iterate fast as native array', () => {
    const itemCount = 1000000;
    const arrayArray = new Array(itemCount).fill(0).map((_, i) => i);
    const arrayMap = new LinkedListTest(arrayArray.map(v => new TestListItem({id: String(v), value: v})));

    const arrTimeStart = new Date();
    for (const v of arrayArray) {}
    const arrTime = new Date().getTime() - arrTimeStart.getTime();

    const mapTimeStart = new Date();
    for (const v of arrayMap) {}
    const mapTime = new Date().getTime() - mapTimeStart.getTime();

    console.log(`
      Iterated over ${itemCount} items.
      Native array: ${arrTime}ms
      LinkedList: ${mapTime}ms
    `);

    expect(mapTime).toBeLessThanOrEqual(arrTime);
  });

});

export class LinkedListTest extends DoublyLinkedList<string, TestListItem, TestListValue> {

}

export class TestListItem extends LinkedListItem<string, TestListValue> {
  
}

export class TestListValue implements LinkedListValue<string> {
  id: string;
  value: number;
}
