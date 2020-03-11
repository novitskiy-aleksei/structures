import { BehaviorSubjectMap } from './behavior-subject-map';
import { async } from '@angular/core/testing';

describe('BehaviorSubjectMap', () => {

  let map: BehaviorSubjectMap<string, object>;

  beforeEach(() => {
    map = new BehaviorSubjectMap<string, object>();
  });

  it('should get and create if not exist', () => {
    const key = 'dummy key';
    const value = {foo: 'bar'};

    expect(map.has(key)).toBe(false);
    expect(map.getOrCreate(key, value).getValue()).toBe(value);
    expect(map.get(key).getValue()).toBe(value);
  });

  it('should emit new values with next method', async(() => {
    const key = 'test key';
    const value = {foo: 'bar'};
    const newValue = {foo: 'bar', baz: {v: false}};

    expect(map.has(key)).toBe(false);
    map.getOrCreate(key, value);
    expect(map.getOrCreate(key).getValue()).toBe(value);
    map.next(key, newValue);

    map.get(key).subscribe(v => {
      expect(v).toBe(newValue);
    });
  }));

  it('should be able to transform to array', () => {
    const testArray = [
      {id: 'id1', v: `test 1`},
      {id: 'id2', v: `test 2`},
      {id: 'id3', v: `test 3`},
    ];

    testArray.forEach(obj => map.set(obj.id, obj));

    expect(map.size()).toBe(testArray.length);
    expect(map.toArray().length).toBe(testArray.length);

    map.toArray().forEach((v, i) => {
      expect(v.getValue()).toBe(testArray[i]);
    });
  });

});
