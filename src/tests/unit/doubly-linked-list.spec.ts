import { generateList, TestLinkedList, TestListItem, TestListValue } from './doubly-linked-list.factory';

describe('Doubly linked list', () => {

  it('should initialize with sample array', () => {
    const itemCount = 100;
    const arrayArray = new Array(itemCount)
      .fill(0)
      .map((_, i) => new TestListItem({id: String(i), testField: i} as TestListValue))
    ;
    const linkedList = new TestLinkedList(arrayArray);

    expect(linkedList.length).toBe(itemCount);
    expect(linkedList.head.value).toEqual({id: '0', testField: 0});
  });

  it('should correct display list items length', () => {
    const list1 = generateList(1);
    const list100 = generateList(100);

    expect(list1.length).toBe(1);
    expect(list100.length).toBe(100);
  });

  it('should indicate that list is empty', () => {
    const listEmpty  = generateList(0);

    expect(listEmpty.length).toBe(0);
    expect(listEmpty.isEmpty()).toBe(true);
  });

  it('should retrieve item by its id', () => {
    const list  = generateList(10);

    expect(list.getBy('7').value.testField).toBe(7);
    expect(list.getBy('0').value.testField).toBe(0);
    expect(list.getBy('9').value.testField).toBe(9);
  });

  it('should reset items in list', () => {
    const list  = generateList(10);

    list.clear();

    expect(list.length).toBe(0);
    expect(list.getBy('0')).toBeUndefined();
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  it('should be able to remove head item from list', () => {
    const list  = generateList(10);

    expect(list.head.value.testField).toBe(0);
    list.removeHead();

    expect(list.head.value.testField).toBe(1);
  });

  it('should be able to remove tail item from list', () => {
    const list  = generateList(10);

    expect(list.tail.value.testField).toBe(9);
    list.removeTail();

    expect(list.tail.value.testField).toBe(8);
  });

  it('should be able to append item to the end of list', () => {
    const list  = generateList(10);

    expect(list.tail.value.testField).toBe(9);
    list.append('10', new TestListItem({id: '10', testField: 10}));

    expect(list.length).toBe(11);
    expect(list.tail.value.testField).toBe(10);
    expect(list.tail.prev.value.testField).toBe(9);
  });

  it('should be able to prepend item in the beginning of list', () => {
    const list  = generateList(8);

    expect(list.head.value.testField).toBe(0);
    list.prepend('-1', new TestListItem({id: '-1', testField: -1}));

    expect(list.length).toBe(9);
    expect(list.head.value.testField).toBe(-1);
    expect(list.head.next.value.testField).toBe(0);
  });

  it('should be able to delete one item from list by its id', () => {
    const list  = generateList(8);

    list.remove('5');

    expect(list.getBy('5')).toBeUndefined();
    expect(list.getBy('4').next.value.testField).toBe(6);
    expect(list.length).toBe(7);
  });

  it('must be able to insert new item after existing one', () => {
    const list  = generateList(10);
    const newItem = new TestListItem({id: 'inserted', testField: 777});

    list.insertPrevTo(newItem.id, newItem, '8');

    expect(list.getBy('inserted')).toBe(newItem);
    expect(list.getBy('8').prev).toBe(newItem);
    expect(list.length).toBe(11);
  });

  it('must be able to insert new item before existing one', () => {
    const list  = generateList(11);
    const newItem = new TestListItem({id: 'inserted', testField: 777});

    list.insertNextTo(newItem.id, newItem, '7');

    expect(list.getBy('inserted')).toBe(newItem);
    expect(list.getBy('7').next).toBe(newItem);
    expect(list.length).toBe(12);
  });
});
