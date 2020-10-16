const deepCopy = (node) => {

    if (typeof(node) !== 'object' || node === null) return node;

    const copied = {};
    Object.keys(node).forEach((key) => {
        copied[key] = deepCopy(node[key])
    })
    return copied;
 };
 export default deepCopy;