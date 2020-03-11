import { BehaviorSubject } from 'rxjs';

export class BehaviorSubjectMap<K = string, T = any> {

  private m = new Map<K, BehaviorSubject<T>>();

  getOrCreate(key: K, defaultValue: T = null): BehaviorSubject<T> {
    return this.m.has(key)
      ? this.m.get(key)
      : this.m.set(key, new BehaviorSubject<T>(defaultValue)).get(key);
  }

  get(key: K): BehaviorSubject<T> {
    return this.m.get(key);
  }

  set(key: K, v: T) {
    return this.m.set(key, new BehaviorSubject(v)).get(key);
  }

  next(k: K, v: T): BehaviorSubject<T> {
    this.getOrCreate(k).next(v);
    return this.get(k);
  }

  has(key: K): boolean {
    return this.m.has(key);
  }

  clear(): void {
    this.m.clear();
  }

  toArray(): BehaviorSubject<T>[] {
    const r = [];
    this.m.forEach(v => r.push(v));

    return r;
  }

  size() {
    return this.m.size;
  }
}
