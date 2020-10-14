import deepCopy from './deep_copy';
const original = {
    primitive: 5,
    obj: {primitive: "test", obj: {}},
    arr: [{primitive: "prim1", obj: {a: "a"}},{primitive: "prim2", obj: {b:"b"}}],
    method: () => "test method",
}

test('these are different objects', () => {
    const copied = deepCopy(original);
    copied.primitive = 6;
    expect(copied.primitive).not.toBe(original.primitive);
});

test('object primitives are equal ', () => {
    const copied = deepCopy(original);
    expect(copied.primitive).toBe(original.primitive);
});

test('inner objects are different', () => {
    const copied = deepCopy(original);
    copied.obj.primitive = "test inner object";
    expect(copied.obj.primitive).not.toBe(original.obj.primitive);
});

test('method was copied', () => {
    const copied = deepCopy(original);    
    expect(copied.method()).toBe("test method");
});

test('objects methods are different', () => {
    const copied = deepCopy(original); 
    copied.method = () => "other test method";   
    expect(copied.method()).not.toBe(original.method());
});

test('array was copied', () => {
    const copied = deepCopy(original);   
    expect(copied.arr.lenght).toBe(original.arr.lenght);
});

test('objects arrays are different', () => {
    const copied = deepCopy(original);
    copied.arr[0].obj.a = "c"   
    expect(copied.arr[0].obj.a).not.toBe(original.arr[0].obj.a);
});