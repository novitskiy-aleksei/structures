import { generateList, TestListItem } from './doubly-linked-list.factory';

describe('Unique id control decorator', () => {

  it('should not append item with duplicated id', () => {
    const list  = generateList(10);
    const newItem = new TestListItem({id: '9', testField: 999});

    expect(() => list.append(newItem)).toThrow('Item with id 9 already exists');

    expect(list.length).toBe(10);
    expect(list.tail.value.testField).toBe(9);
  });

});
