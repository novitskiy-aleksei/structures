import { TestLinkedList, TestListItem, TestListValue } from './doubly-linked-list.factory';

describe('Doubly linked list', () => {

  it('should initialize with sample array', () => {
    const itemCount = 100;
    const arrayArray = new Array(itemCount)
      .fill(0)
      .map((_, i) => new TestListItem({id: String(i), value: i} as TestListValue))
    ;
    const linkedList = new TestLinkedList(arrayArray);

    expect(linkedList.length).toBe(itemCount);
    expect(linkedList.head.value).toEqual({id: '0', value: 0});
  });

});
