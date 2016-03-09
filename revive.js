var createKey = require('./createKey'),
    keyKey = createKey(-1),
    isInstance = require('./isInstance');

function revive(input){
    var objects = {},
        scannedObjects = [];

    function scan(input){
        var output = input;

        if(!isInstance(input) || !(keyKey in input)){
            return output;
        }

        output = input && input instanceof Array ? [] : typeof input === 'function' ? input : {};

        if(input[keyKey]){
            objects[input[keyKey]] = output;
        }

        for(var key in input){
            var value = input[key];

            if(key === keyKey){
                continue;
            }

            if(isInstance(value)){
                if(scannedObjects.indexOf(value)<0){
                    scannedObjects.push(value);
                    output[key] = scan(value);
                }
            }else if(
                typeof value === 'string' &&
                value.length === 1 &&
                value.charCodeAt(0) > keyKey.charCodeAt(0) &&
                value in objects
            ){
                output[key] = objects[value];
            }else{
                output[key] = input[key];
            }
        }

        return output;
    }

    if(!input || typeof input !== 'object'){
        return input;
    }

    return scan(input);
}

module.exports = revive;