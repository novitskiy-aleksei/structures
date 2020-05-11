import { DoublyLinkedList } from '../../../lib/doubly-linked-list/doubly-linked-list';
import { LinkedListItem } from '../../../lib/doubly-linked-list/linked-list-item';
import { LinkedListValue } from '../../../lib/doubly-linked-list/linked-list-value';

export class TestLinkedList extends DoublyLinkedList<string, TestListItem, TestListValue> {

}

export class TestListItem extends LinkedListItem<string, TestListValue> {

}

export class TestListValue implements LinkedListValue<string> {
  id: string;
  testField: number;
}

export function generateList(length: number) {
  const arrayArray = new Array(length)
    .fill(0)
    .map((_, i) => new TestListItem({id: String(i), testField: i} as TestListValue))
  ;

  return new TestLinkedList(arrayArray);
}

export function generateArray(length: number) {
  return new Array(length)
    .fill(0)
    .map((_, i) => i)
  ;
}
