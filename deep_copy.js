 const deepCopy = (obj) => {
    const copied = {};
    for (let key in obj) {
        if (typeof(obj[key]) !== "object") copied[key] = obj[key];
        else copied[key] = deepCopy(obj[key])
    }
    return copied;
 };
 export default deepCopy;