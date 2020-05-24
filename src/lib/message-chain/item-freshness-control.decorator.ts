/**
 * Adds ability to overwrite existing items with same id and position with newer copies
 *
 * - Skips host method calling if existing item has fresher timestamp
 * - Replaces existing item if newItem has same id and larger timestamp (calls DoublyLinkedList.update)
 *
 * *Relates on MessageChainValue.created field
 *
 * @internal
 */
export function ItemFreshnessControl(): MethodDecorator {
  return (target: () => unknown, methodName: string, descriptor: TypedPropertyDescriptor<any>): unknown => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]): unknown { // eslint-disable-line @typescript-eslint/no-explicit-any
      // look for newly inserted item in first and second args
      let [position, newItem] = args; // eslint-disable-line prefer-const
      let existingItem;

      switch (methodName) {
        case 'insertNextTo': {
          existingItem = this.getBy(position).next;
          break;
        }
        case 'insertPrevTo': {
          existingItem = this.getBy(position).prev;
          break;
        }
        case 'prepend': {
          newItem = position;
          existingItem = this.head;
          break;
        }
        case 'append': {
          newItem = position;
          existingItem = this.tail;
          break;
        }
      }

      if (!existingItem || existingItem.id !== newItem.id) {
        return originalMethod.apply(this, args);
      }

      if (existingItem.value?.created >= 0 && existingItem.value.created > newItem.value.created) {
        return this;
      }

      return this.update(newItem);
    };

    return descriptor;
  };
}

