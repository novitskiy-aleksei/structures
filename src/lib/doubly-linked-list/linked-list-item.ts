import { LinkedListValue } from './linked-list-value';

/**
 * Wraps linked list item with various information about siblings
 *
 * @public
 */
export abstract class LinkedListItem<ListId, ListValue extends LinkedListValue<ListId>> {
  /**
   * Item identifier
   */
  id: ListId;

  /**
   * Pointer to previous list item
   *
   * null - no loaded previous items
   * undefined - this item is list starting element
   */
  prev: LinkedListItem<ListId, ListValue> | null | undefined;

  /**
   * Pointer to next list item
   *
   * null - no loaded next items
   * undefined - this item is list last element, no loading required
   */
  next: LinkedListItem<ListId, ListValue> | null | undefined;

  /**
   * Original list item value which was wrapped
   */
  value: ListValue;

  constructor(
    value: ListValue,
    prev: LinkedListItem<ListId, ListValue> = null,
    next: LinkedListItem<ListId, ListValue> = null
  ) {
    if (value) {
      this.id = value.id;
      this.value = value;
    }
    this.next = next;
    this.prev = prev;
  }

  /**
   * Marks this element as global list ending
   */
  markAsEnd() {
    if (this.next) {
      throw new Error(`Unable to mark [${this.id}] as list ending cause it is not last item\r\n` + this.log());
    }

    this.next = undefined;
  }

  /**
   * Marks this element as global list begin
   */
  markAsBegin() {
    if (this.prev) {
      throw new Error(`Unable to mark [${this.id}] as list beginning cause it is not last item\r\n` + this.log());
    }

    this.prev = undefined;
  }

  /**
   * Calculates element amount left to list begin
   */
  headDistance(): number {
    return this.prev ? 1 + this.prev.headDistance() : 0;
  }

  /**
   * Calculates element amount left to list ending
   */
  tailDistance(): number {
    return this.next ? 1 + this.next.tailDistance() : 0;
  }

  /**
   * Make string representation of this item for debugging purposes
   */
  log(): string {
    const p = this.prev ? this.prev.value.id : '-';
    const n = this.next ? this.next.value.id : '-';
    return `${p} <-prev ${this.value.id} next -> ${n}`;
  }

}
