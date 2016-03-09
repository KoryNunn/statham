var revive = require('./revive');

function parse(json, reviver){
    return revive(JSON.parse(json, reviver));
}

module.exports = parse;