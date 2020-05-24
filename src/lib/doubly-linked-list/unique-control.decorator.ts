import { LinkedListItem } from './linked-list-item';

export function UniqueControl(): MethodDecorator {
  return (target: () => any, key: string, descriptor: any) => { // eslint-disable-line
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]): unknown { // eslint-disable-line @typescript-eslint/no-explicit-any
      // look for newly inserted item in first and second args
      let [position, newItem] = args; // eslint-disable-line prefer-const
      if (position instanceof LinkedListItem) {
        newItem = position;
      }

      const existingItem = this.getBy(newItem.id);

      if (existingItem) {
        throw new Error(`Item with id ${newItem.id} already exists`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

