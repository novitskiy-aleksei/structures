import { LinkedListItem } from './linked-list-item';
import { LinkedListValue } from './linked-list-value';
import { UniqueControl } from './unique-control.decorator';

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
export abstract class DoublyLinkedList<
  ListId = string,
  ListValue extends LinkedListValue<ListId> = LinkedListValue<ListId>,
  ListItem extends LinkedListItem<ListId, ListValue> = LinkedListItem<ListId, ListValue>,
> {

  /**
   * First item in a linked list, has no items after it (no prev)
   */
  public head: ListItem;
  /**
   * Last item in a linked list, has no items before it (no next)
   */
  public tail: ListItem;

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
    items.map(elem => this.append(elem));
  }

  /**
   * Generator for iterating through list like native array
   */
  *iterator(): IterableIterator<ListItem> {
    let currentItem: ListItem = this.head;

    while (currentItem) {
      yield currentItem;
      currentItem = currentItem.next;
    }
  }

  /**
   * Iterator shorthand for iterating list object just like it is a native array
   */
  [Symbol.iterator](): IterableIterator<ListItem> {
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
   * @param position - id of existing element next to which make insert
   * @param newItem - inserted item
   */
  @UniqueControl()
  insertNextTo(position: ListId, newItem: ListItem): this {
    newItem = newItem.copy();
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
      this.hashTable.set(newItem.id, newItem);
      this._length++;

      return this;
    }
  }

  /**
   * Insert new item to the list at given position
   *
   * @param position - id of existing element previous to which make insert
   * @param newItem - inserted item
   */
  @UniqueControl()
  insertPrevTo(position: ListId, newItem: ListItem): this {
    newItem = newItem.copy();
    const nextItem = this.hashTable.get(position);

    if (!nextItem) {
      throw new Error(`Item ${position} not found to insert after`);
    }

    newItem.next = nextItem;
    newItem.prev = nextItem.prev;

    if (!nextItem.prev) {
      this.head = newItem;
    } else {
      nextItem.prev.next = newItem;
    }

    nextItem.prev = newItem;
    this.hashTable.set(newItem.id, newItem);
    this._length++;

    return this;
  }

  /**
    * Adds the element at the end of the linked list
   *
   * @param newItem - item for adding to the end of list
   */
  @UniqueControl()
  append(newItem: ListItem): this {
    newItem = newItem.copy();
    if (!this.tail) {
      this.head = this.tail = newItem;
    } else {
      newItem.prev = this.tail;
      this.tail.next = newItem;
      this.tail = newItem;
    }

    this.hashTable.set(newItem.id, newItem);
    this._length++;

    return this;
  }

  /**
   * Adds the element at the beginning of the linked list
   *
   * @param newItem - item for adding to the beginning of list
   */
  @UniqueControl()
  prepend(newItem: ListItem): this {
    newItem = newItem.copy();
    this.hashTable.set(newItem.id, newItem);

    if (!this.head) {
      this.head = this.tail = newItem;
    } else {
      newItem.next = this.head;
      this.head.prev = newItem;
      this.head = newItem;
    }

    this._length++;

    return this;
  }

  /**
   * Update existing item with provided one
   *
   * @param newItem Element to replace existing item in list
   */
  update(newItem: ListItem): this {
    if (!this.hashTable.has(newItem.id)) {
      throw new Error(`Unable to update: item with id ${newItem.id} does not exists`);
    }

    const item = this.hashTable.get(newItem.id);
    item.value = newItem.value;
    this.hashTable.set(item.id, item);

    if (this.tail.id === newItem.id) {
      this.tail = newItem;
    }
    if (this.head.id === newItem.id) {
      this.head = newItem;
    }

    return this;
  }

  /**
   * Deletes item from linked list
   *
   * @param key - identifier for seeking deletion item
   */
  remove(key: ListId): this {
    const currentItem = this.hashTable.get(key);

    if (!currentItem) {
      return this;
    }

    if (currentItem.prev) {
      currentItem.prev.next = currentItem.next;
    } else {
      this.head = currentItem.next;
    }

    if (currentItem.next) {
      currentItem.next.prev = currentItem.prev;
    } else {
      this.tail = currentItem.prev;
    }

    currentItem.next = null;
    currentItem.prev = null;
    this.hashTable.delete(key);
    this._length--;

    return this;
  }

  /**
   * Deletes first item in a list
   */
  removeHead(): this {
    return this.remove(this.head.id);
  }

  /**
   * Deletes last item in a list
   */
  removeTail(): this {
    return this.remove(this.tail.id);
  }

  toArray(): IterableIterator<ListItem> {
    return this.iterator();
  }

  /**
   * Resets list
   *
   * Removes all items, sets length to zero, head&tail to null
   */
  clear(): void {
    this._length = 0;
    this.tail = null;
    this.head = null;
    this.hashTable.clear();
  }

  /**
   * Return visualisation string of list for debugging
   */
  log(): string {
    let str = ':| ';
    let item = this.head;

    if (item && item.prev === undefined) {
      str = '[global head] ' + str;
    }
    while (item) {
      str += ` ${item.value.id} ->`;
      item = item.next;
    }
    if (item === undefined) {
      str += ' [global tail end]';
    } else {
      str += '>>'
    }

    return str;
  }

}
