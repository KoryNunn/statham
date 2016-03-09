module.exports = function isInstance(value){
    return value && typeof value === 'object' || typeof value === 'function';
};