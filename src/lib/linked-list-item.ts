import { LinkedListValue } from './linked-list-value';
import { LoadRequest } from './chain-load-request';
import { RetrieveDirection } from './retrieve-direction';

export abstract class LinkedListItem<K, T extends LinkedListValue<K>, V> {
  id: K;
  created: number;
  nextId: string;
  prevId: string;
  // tslint:disable-next-line:variable-name
  protected _nextId: string;
  // tslint:disable-next-line:variable-name
  protected _prevId: string;
  prev: LinkedListItem<K, T, V>;
  next: LinkedListItem<K, T, V>;
  value: T;

  constructor(
    value: T,
    prev: LinkedListItem<K, T, V> = null,
    next: LinkedListItem<K, T, V> = null
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

  markAsBegin() {
    this.prev = undefined;
  }

  headDistance(): number {
    return this.prev ? 1 + this.prev.headDistance() : 0;
  }

  needLoad(): boolean {
    return this.next === null || this.prev === null;
  }

  getLoadInfo(): Partial<LoadRequest> {
    if (!this.prev) {
      return {direction: RetrieveDirection.down, from: this.value.id};
    }
    if (!this.next) {
      return {direction: RetrieveDirection.up, from: this.value.id};
    }
  }

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
