import { LinkedListItem } from './linked-list-item';
import { LinkedListValue } from './linked-list-value';

/**
 * @public
 */
export abstract class DoublyLinkedList<ListId, ListItem extends LinkedListItem<ListId, ListValue>, ListValue extends LinkedListValue<ListId>> {

  protected readonly hashTable = new Map<ListId, ListItem>();
  public head: LinkedListItem<ListId, ListValue>;
  public tail: LinkedListItem<ListId, ListValue>;
  protected length: number;

  constructor(items: ListItem[]) {
    this.clear();
    items.map(elem => this.append(elem.value.id, elem));
  }

  *iterator(): IterableIterator<LinkedListItem<ListId, ListValue>> {
    let currentItem = this.tail;

    while (currentItem) {
      yield currentItem;
      currentItem = currentItem.prev;
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  getHead(): ListValue {
    return this.head ? this.head.value : null;
  }

  getTail(): ListValue {
    return this.tail ? this.tail.value : null;
  }

  getLength(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return !!this.length;
  }

  getBy(key: ListId): ListItem | undefined {
    return this.hashTable.get(key);
  }

  protected insertNextTo(key: ListId, newItem: ListItem, previousKey: ListId): ListItem {

    if (this.isOld(newItem)) {
      return null;
    }

    this.hashTable.set(key, newItem);

    const previousItem = this.hashTable.get(previousKey);

    if (!previousItem) {
      console.warn(`Can't insert after item with id ${previousKey} `);
      return null;
    } else {
      newItem.prev = previousItem;
      newItem.next = previousItem.next;

      if (!previousItem.next) {
        this.tail = newItem;
      } else {
        previousItem.next.prev = newItem;
      }

      previousItem.next = newItem;
      this.length++;

      return newItem;
    }
  }

  protected insertPrevTo(key: ListId, newItemIn: ListItem, nextKey: ListId): ListItem {

    if (this.isOld(newItemIn)) {
      return null;
    }

    this.hashTable.set(key, newItemIn);
    const newItem = this.hashTable.get(key);
    const nextItem = this.hashTable.get(nextKey);

    if (!nextItem) {
      throw new Error(`Item ${nextKey} not found to insert after`);
    } else {
      newItem.next = nextItem;
      newItem.prev = nextItem.prev;

      if (!nextItem.prev) {
        this.tail = newItem;
      } else {
        nextItem.prev.next = newItem;
      }

      nextItem.prev = newItem;
      this.length++;

      return newItem;
    }
  }

  // Adds the element at the end of the linked list
  append(key: ListId, newItem: ListItem): ListId {

    if (this.isOld(newItem)) {
      return null;
    }

    if (!this.tail) {
      this.head = this.tail = newItem;
    } else {
      newItem.prev = this.tail;
      this.tail.next = newItem;
      this.tail = newItem;
    }

    this.hashTable.set(key, newItem);
    this.length++;

    return key;
  }

  // Add the element at the beginning of the linked list
  prepend(key: ListId, newItem: ListItem): ListId {

    if (this.isOld(newItem)) {
      return null;
    }

    this.hashTable.set(key, newItem);

    if (!this.head) {
      this.head = this.tail = newItem;
    } else {
      newItem.next = this.head;
      this.head.prev = newItem;
      this.head = newItem;
    }

    this.length++;

    return key;
  }

  remove(key: ListId): ListValue {

    const currentItem = this.hashTable.get(key);

    if (!currentItem) {
      return;
    }

    if (currentItem === this.head) {
      return this.removeHead();
    } else if (currentItem === this.tail) {
      return this.removeTail();
    } else {
      currentItem.prev.next = currentItem.next;
      currentItem.next.prev = currentItem.prev;
    }

    currentItem.next = null;
    currentItem.prev = null;
    this.hashTable.delete(key);
    this.length--;
    return currentItem.value;
  }

  removeHead(): ListValue {

    const currentItem = this.head;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this.head.next) {
      this.head = null;
      this.tail = null;

      // full list
    } else {
      this.head.next.prev = null;
      this.head = this.head.next;
    }

    currentItem.next = currentItem.prev = null;
    this.hashTable.delete(currentItem.value.id);
    this.length--;
    return currentItem.value;
  }

  removeTail(): ListValue {
    const currentItem = this.tail;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this.tail.prev) {
      this.head = null;
      this.tail = null;

      // full list
    } else {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    }

    currentItem.next = currentItem.prev = null;
    this.hashTable.delete(currentItem.value.id);
    this.length--;
    return currentItem.value;
  }

  toArray(): IterableIterator<LinkedListItem<ListId, ListValue>> {
    return this.iterator();
  }

  clear() {
    this.length = 0;
    this.tail = null;
    this.head = null;
    this.hashTable.clear();
  }

  protected isOld(item: ListItem): boolean {
    const exist = this.hashTable.get(item.value.id);

    return exist ? exist.value.created >= item.value.created : false;
  }
}
