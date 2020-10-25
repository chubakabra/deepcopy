import deepCopy from './deep_copy';

describe("deep copy tests", () => {
    const original = {
        primitive: 5,
        obj: {primitive: "test", obj: {}},
        arr: [{primitive: 1, obj: {a: "a"}},{primitive: 2, obj: {b:"b"}}],
        method: () => "test method",
        nullField: null
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

    test('inner objects are different + shallow copied test', () => {
        const shallowCopied = {...original};
        const deepCopied = deepCopy(original);
        expect(shallowCopied.obj === original.obj).toBeTruthy();
        expect(deepCopied.odj === original.obj).toBeFalsy();
    });

    test('method was copied', () => {
        const copied = deepCopy(original);    
        expect(copied.method()).toBe(original.method());
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

    test('objects of array are different + shallow copied test', () => {
        const shallowCopied = {...original};
        const deepCopied = deepCopy(original);
        original.arr[0].obj.a = "c";
        expect(shallowCopied.arr[0].obj.a).toBe(original.arr[0].obj.a);   
        expect(deepCopied.arr[0].obj.a).not.toBe(original.arr[0].obj.a);
        
    });

    test('objects of array are different + shallow copied test', () => {
        const shallowCopied = {...original};
        const deepCopied = deepCopy(original); 
        expect(Array.isArray(shallowCopied.arr)).toBeTruthy(); 
        expect(Array.isArray(deepCopied.arr)).toBeTruthy();
    });

    test('null copy correctly', () => {
        const copied = deepCopy(original);  
        expect(copied.nullField).toBeNull();
    });
})