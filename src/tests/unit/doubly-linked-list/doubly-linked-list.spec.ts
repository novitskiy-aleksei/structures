import { generateArray, generateList, TestLinkedList, TestListItem, TestListValue } from './doubly-linked-list.factory';
import { iterationPassAssert } from './iteration-pass-assert';

describe('Doubly linked list', () => {

  let iterationPassTest: {
    list: TestLinkedList,
    cast: number[],
  };

  afterEach(() => {
    if (iterationPassTest?.list) {
      iterationPassAssert(iterationPassTest.list, iterationPassTest.cast);
    }
  });

  it('should initialize with sample array', () => {
    const itemCount = 100;
    const arrayArray = new Array(itemCount)
      .fill(0)
      .map((_, i) => new TestListItem({id: String(i), testField: i} as TestListValue))
    ;
    const linkedList = new TestLinkedList(arrayArray);

    expect(linkedList.length).toBe(itemCount);
    expect(linkedList.head.value).toEqual({id: '0', testField: 0});

    iterationPassTest = {
      cast: generateArray(itemCount),
      list: linkedList,
    }
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

    const cast = generateArray(10);
    cast.shift();
    iterationPassTest = {cast, list};
  });

  it('should be able to remove tail item from list', () => {
    const list  = generateList(10);

    expect(list.tail.value.testField).toBe(9);
    list.removeTail();

    expect(list.tail.value.testField).toBe(8);
    const cast = generateArray(10);
    cast.pop();
    iterationPassTest = {cast, list};
  });

  it('should be able to append item to the end of list', () => {
    const list  = generateList(10);

    expect(list.tail.value.testField).toBe(9);
    list.append(new TestListItem({id: '10', testField: 10}));

    expect(list.length).toBe(11);
    expect(list.tail.value.testField).toBe(10);
    expect(list.tail.prev.value.testField).toBe(9);

    iterationPassTest = {
      cast: generateArray(11),
      list,
    };
  });

  it('should be able to prepend item in the beginning of list', () => {
    const list  = generateList(8);

    expect(list.head.value.testField).toBe(0);
    list.prepend(new TestListItem({id: '-1', testField: -1}));

    expect(list.length).toBe(9);
    expect(list.head.value.testField).toBe(-1);
    expect(list.head.next.value.testField).toBe(0);

    const cast = generateArray(8);
    cast.unshift(-1);
    iterationPassTest = {cast, list};
  });

  it('should be able to delete one item from list by its id', () => {
    const list  = generateList(8);

    expect(list.remove('5')).toBe(list);

    expect(list.getBy('5')).toBeUndefined();
    expect(list.getBy('4').next.value.testField).toBe(6);
    expect(list.length).toBe(7);

    const cast = generateArray(8);
    cast.splice(5, 1);
    iterationPassTest = {cast, list};
  });

  it('must be able to insert new item after existing one', () => {
    const list  = generateList(10);
    const newItem = new TestListItem({id: '777', testField: 777});

    list.insertPrevTo('8', newItem);

    expect(list.getBy('777')).toBe(newItem);
    expect(list.getBy('8').prev).toBe(newItem);
    expect(list.length).toBe(11);

    const cast = generateArray(10);
    cast.splice(8, 0, 777);
    iterationPassTest = {cast, list};
  });

  it('must be able to insert new item before existing one', () => {
    const list  = generateList(11);
    const newItem = new TestListItem({id: '777', testField: 777});

    list.insertNextTo('7', newItem);

    expect(list.getBy('777')).toBe(newItem);
    expect(list.getBy('7').next).toBe(newItem);
    expect(list.length).toBe(12);

    const cast = generateArray(11);
    cast.splice(8, 0, 777);
    iterationPassTest = {cast, list};
  });
});
