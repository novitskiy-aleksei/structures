import { MessageChainElement } from './message-chain.element';

function controlLimitOverflow(newItem: MessageChainElement<any, any>): void { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!this.chainLimit || this.length <= this.chainLimit) {
    return;
  }

  const assimilated = this.hashTable.get(newItem.id);

  let prev = assimilated.prev;
  let next = assimilated.next;
  let tailDist = 0;
  let headDist = 0;

  // speed up searching element position if it's on edges
  if ((assimilated === this.tail || assimilated === this.head) && this.length > 1) {
    if (this.tail === assimilated) {
      tailDist = 0;
      headDist = 1;
    } else {
      tailDist = 1;
      headDist = 0;
    }
  } else {
    while (prev || next) {
      if (prev) {
        tailDist++;
        prev = prev.prev;
      }
      if (next) {
        headDist++;
        next = next.next;
      }
    }
  }

  if (tailDist < headDist) {
    this.removeHead();
  } else {
    this.removeTail();
  }
}

export function ChainLimitControl(): MethodDecorator {
  return (target: () => any, key: string, descriptor: any): unknown => { // eslint-disable-line @typescript-eslint/no-explicit-any

    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]): unknown { // eslint-disable-line @typescript-eslint/no-explicit-any
      const result = originalMethod.apply(this, args);
      controlLimitOverflow.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
