
export abstract class ListOperator<T> {
  protected list: T[];

  constructor(data: T[] = []) {
    this.list = data;
  }

  all(): T[] {
    return this.list;
  }

  has(item: T, identity: keyof T): boolean {
    return this.list.findIndex(v => v[identity] === item[identity]) >= 0;
  }

  addNew(item: T) {
    this.list.unshift(item);
  }

  updateItemWith(key: keyof T, value: T): boolean {
    const candidatePos = this.list.findIndex(c => c[key] === value[key]);
    if (candidatePos >= 0) {
      this.list[candidatePos] = value;

      return true;
    }

    return false;
  }
}
