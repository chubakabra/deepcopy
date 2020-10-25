const deepCopy = (node) => {
    let copy;
    if (typeof(node) !== 'object' || node === null) {
        copy = node;       
    } else {
        copy = {};
        Object.getOwnPropertyNames(node).forEach((key) => {
            copy[key] = deepCopy(node[key]);
        });
        Object.getOwnPropertySymbols(node).forEach((symbolKey) => {
            copy[symbolKey] = deepCopy(node[symbolKey]);
        });
    }    
    return Array.isArray(node) ? Array.from(copy) : copy;
 };
 export default deepCopy;