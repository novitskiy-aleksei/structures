export function ChainLimitControl(): MethodDecorator {
  return (target: () => any, key: string, descriptor: any) => {

    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const result = originalMethod.apply(this, args);
      this.controlLimitOverflow(args[1]);
      return result;
    };

    return descriptor;
  };
}
