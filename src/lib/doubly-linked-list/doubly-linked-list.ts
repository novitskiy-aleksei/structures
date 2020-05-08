import { LinkedListItem } from './linked-list-item';
import { LinkedListValue } from './linked-list-value';

/**
 * Doubly linked list
 *
 * Uses ES2015 Map for storing items which is more efficient in manipulating
 * list items instead array especially on large amount of nodes.
 * Contains helper functions for inserting, checking, etc
 *
 * todo: usage
 *
 * @public
 */
export abstract class DoublyLinkedList<ListId, ListItem extends LinkedListItem<ListId, ListValue>, ListValue extends LinkedListValue<ListId>> {

  /**
   * First item in a linked list, has no items after it (no prev)
   */
  public head: LinkedListItem<ListId, ListValue>;
  /**
   * Last item in a linked list, has no items before it (no next)
   */
  public tail: LinkedListItem<ListId, ListValue>;

  /**
   * Indicates amount of items in list, usually must be equal to map length
   */
  protected _length: number;
  /**
   * Store for list items
   *
   * Here used a Map with custom iterator (see this.*iterator()) instead of usual array
   * cause Map works faster in most operations which required to manipulate linked list.
   * Even iteration in for loop with 'downlevelIteration' flag in most environments works
   * equal or faster. (see performance tests)
   */
  protected readonly hashTable = new Map<ListId, ListItem>();

  /**
   * Initialize list with items array, first array item becomes a head
   */
  constructor(items: ListItem[]) {
    this.clear();
    items.map(elem => this.append(elem.value.id, elem));
  }

  /**
   * Generator for iterating through list like native array
   */
  *iterator(): IterableIterator<LinkedListItem<ListId, ListValue>> {
    let currentItem = this.head;

    while (currentItem) {
      yield currentItem;
      currentItem = currentItem.next;
    }
  }

  /**
   * Iterator shorthand for iterating list object just like it is a native array
   */
  [Symbol.iterator]() {
    return this.iterator();
  }

  /**
   * Get the amount of items in list
   */
  get length(): number {
    return this._length;
  }

  /**
   * Indicate that list has no items
   */
  isEmpty(): boolean {
    return !this.length;
  }

  /**
   * Retrieve item by provided key
   */
  getBy(key: ListId): ListItem | undefined {
    return this.hashTable.get(key);
  }

  /**
   * Insert new item to the list at given position
   *
   * @param newKey - identifier used to store inserted item
   * @param newItem - inserted item
   * @param position - id of existing element next to which make insert
   */
  insertNextTo(newKey: ListId, newItem: ListItem, position: ListId): ListItem {
    this.hashTable.set(newKey, newItem);

    const previousItem = this.hashTable.get(position);

    if (!previousItem) {
      console.warn(`Can't insert after item with id ${position} `);
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
      this._length++;

      return newItem;
    }
  }

  /**
   * Insert new item to the list at given position
   *
   * @param newKey - identifier used to store inserted item
   * @param newItemIn - inserted item
   * @param position - id of existing element previous to which make insert
   */
  insertPrevTo(newKey: ListId, newItemIn: ListItem, position: ListId): ListItem {
    this.hashTable.set(newKey, newItemIn);
    const newItem = this.hashTable.get(newKey);
    const nextItem = this.hashTable.get(position);

    if (!nextItem) {
      throw new Error(`Item ${position} not found to insert after`);
    } else {
      newItem.next = nextItem;
      newItem.prev = nextItem.prev;

      if (!nextItem.prev) {
        this.tail = newItem;
      } else {
        nextItem.prev.next = newItem;
      }

      nextItem.prev = newItem;
      this._length++;

      return newItem;
    }
  }

  /**
    * Adds the element at the end of the linked list
   *
   * @param key - a key which is used to store new item in list
   * @param newItem - item for adding to the end of list
   */
  append(key: ListId, newItem: ListItem): ListId {

    if (!this.tail) {
      this.head = this.tail = newItem;
    } else {
      newItem.prev = this.tail;
      this.tail.next = newItem;
      this.tail = newItem;
    }

    this.hashTable.set(key, newItem);
    this._length++;

    return key;
  }

  /**
   * Adds the element at the beginning of the linked list
   *
   * @param key - a key which is used to store new item in list
   * @param newItem - item for adding to the beginning of list
   */
  prepend(key: ListId, newItem: ListItem): ListId {

    this.hashTable.set(key, newItem);

    if (!this.head) {
      this.head = this.tail = newItem;
    } else {
      newItem.next = this.head;
      this.head.prev = newItem;
      this.head = newItem;
    }

    this._length++;

    return key;
  }

  /**
   * Deletes item from linked list
   *
   * @param key - identifier for seeking deletion item
   */
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
    this._length--;
    return currentItem.value;
  }

  /**
   * Deletes first item in a list
   */
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
    this._length--;
    return currentItem.value;
  }

  /**
   * Deletes last item in a list
   */
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
    this._length--;
    return currentItem.value;
  }

  toArray(): IterableIterator<LinkedListItem<ListId, ListValue>> {
    return this.iterator();
  }

  /**
   * Resets list
   *
   * Removes all items, sets length to zero, head&tail to null
   */
  clear() {
    this._length = 0;
    this.tail = null;
    this.head = null;
    this.hashTable.clear();
  }

}
