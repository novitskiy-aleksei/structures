import { LinkedListValue } from './linked-list-value';
import { LoadMetadata } from './load-metadata';
import { RetrieveDirection } from './retrieve-direction';

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
    this.next = undefined;
  }

  /**
   * Marks this element as global list begin
   */
  markAsBegin() {
    this.prev = undefined;
  }

  /**
   * Calculates element amount left to list begin
   */
  headDistance(): number {
    return this.prev ? 1 + this.prev.headDistance() : 0;
  }

  /**
   * Determines if this element has siblings which require loading
   */
  needLoad(): boolean {
    return this.next === null || this.prev === null;
  }

  /**
   * Get loading metadata - loading direction and edge item id
   */
  getLoadInfo(): Partial<LoadMetadata> {
    if (!this.prev) {
      return {direction: RetrieveDirection.down, from: this.value.id};
    }
    if (!this.next) {
      return {direction: RetrieveDirection.up, from: this.value.id};
    }
  }

  /**
   * Make string representation of this item for debugging purposes
   */
  log(): string {
    const p = this.prev ? this.prev.value.id : '-';
    const n = this.next ? this.next.value.id : '-';
    return `${p} <-prev ${this.value.id} next -> ${n}`;
  }

  clone(): void {
    // throw new Error('Not implemented');
    // console.log({...this.value});
    // return new ChainElement(
    //   // new Message({...this.value}),
    //   // this.prev ? this.prev.clone() : this.prev,
    //   // this.next ? this.next.clone() : this.next,
    // );
  }
}
