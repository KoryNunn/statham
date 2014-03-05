var createKey = require('./createKey'),
    keyKey = createKey(-1);

function revive(input){
        objects = {};
        scannedObjects = [];

    function scan(input){
        if(input[keyKey]){
            objects[input[keyKey]] = input;
            delete input[keyKey];
        }

        for(var key in input){
            var value = input[key];

            if(value != null && typeof value === 'object'){
                if(scannedObjects.indexOf(value)<0){
                    scannedObjects.push(value);
                    scan(value);
                }
            }

            if(typeof value === 'string' && value.length === 1 && value.charCodeAt(0) > keyKey.charCodeAt(0)){
                input[key] = objects[value];
            }
        }
        return input;
    }

    return scan(input);
}

module.exports = revive;