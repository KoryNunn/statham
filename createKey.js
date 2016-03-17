var toBase = require('to-base'),
    offset = 0xE001,
    base = 0xFFFF - offset;

function createKey(number){
    if(!number){
        return String.fromCharCode(offset);
    }

    return toBase(number, base).reverse().map(function(column){
        return String.fromCharCode(column + offset);
    }).join('');
}

module.exports = createKey;