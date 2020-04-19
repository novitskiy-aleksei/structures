import { DoublyLinkedList } from '../../lib/doubly-linked-list';
import { LinkedListItem } from '../../lib/linked-list-item';
import { LinkedListValue } from '../../lib/linked-list-value';

export class TestLinkedList extends DoublyLinkedList<string, TestListItem, TestListValue> {

}

export class TestListItem extends LinkedListItem<string, TestListValue> {

}

export class TestListValue implements LinkedListValue<string> {
  id: string;
  value: number;
}

export function generateList(length: number) {
  const arrayArray = new Array(length)
    .fill(0)
    .map((_, i) => new TestListItem({id: String(i), value: i} as TestListValue))
  ;

  return new TestLinkedList(arrayArray);
}
