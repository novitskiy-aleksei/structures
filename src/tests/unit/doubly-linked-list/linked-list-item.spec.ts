import { generateList } from './doubly-linked-list.factory';

describe('Doubly linked list', () => {

  it('should be able to mark self as a global beginning of list', () => {
    const list = generateList(5);
    expect(list.head.prev).toBe(null);

    list.head.markAsBegin();

    expect(list.head.prev).toBe(undefined);
    expect(list.getBy('3').markAsEnd).toThrow();
  });

  it('should be able to mark self as a global ending of list', () => {
    const list = generateList(5);

    expect(list.tail.next).toBe(null);
    list.tail.markAsEnd();
    expect(list.tail.next).toBe(undefined);

    expect(list.getBy('3').markAsEnd).toThrow();
  });

  it('should be able to calculate position relative to list bounds', () => {
    const list = generateList(10);

    expect(list.head.headDistance()).toBe(0);
    expect(list.tail.headDistance()).toBe(9);
    expect(list.getBy('3').headDistance()).toBe(3);

    expect(list.tail.tailDistance()).toBe(0);
    expect(list.head.tailDistance()).toBe(9);
    expect(list.getBy('3').tailDistance()).toBe(6);
  });

});
