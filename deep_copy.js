const deepCopy = (node) => {
    let copy;
    if (typeof(node) !== 'object' || node === null) {
        copy = node;
    } else {
        copy = {};
        Object.keys(node).forEach((key) => {
            copy[key] = deepCopy(node[key]);
        })
    
        if (Array.isArray(node)) {
            copy.length = node.length;
            copy = Array.from(copy);
        }
    }    
    return copy;
 };
 export default deepCopy;