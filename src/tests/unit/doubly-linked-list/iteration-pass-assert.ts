import { DoublyLinkedList } from '../../../lib/doubly-linked-list/doubly-linked-list';

/**
 * Checks every item link validity through iteration,
 * compare linked list with reference array
 *
 * iterationPassAssert(0 -> 1 -> 2, [0, 1, 2]) // pass
 * iterationPassAssert(0 -> 1 -> 2, [0, 1, 3]) // fail
 *
 * @param list target for asserting
 * @param cast reference array to be compared of
 */
export function iterationPassAssert(list: DoublyLinkedList, cast: number[]) {
  expect(list.length).toBe(cast.length);

  let item = list.head;

  // head -> tail
  for (let i = 0; !!item; item = item.next, i++) {
    expect(item.id).toBe(cast[i].toString());
  }
  // tail -> head
  for (let i = list.length; !!item; item = item.next, i--) {
    expect(item.id).toBe(cast[i].toString());
  }
}
