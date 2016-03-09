var createKey = require('./createKey'),
    keyKey = createKey(-1),
    isInstance = require('./isInstance');

function revive(input){
    var objects = {},
        scannedObjects = [],
        scannedOutputs = [];

    function scan(input){

        var output = input;

        if(!isInstance(input)){
            return output;
        }

        var inputIndex = scannedObjects.indexOf(input);

        if(~inputIndex){
            return scannedOutputs[inputIndex];
        }

        output = input && input instanceof Array ? [] : typeof input === 'function' ? input : {};

        scannedObjects.push(input);
        scannedOutputs.push(output);

        if(keyKey in input){
            objects[input[keyKey]] = output;
        }

        for(var key in input){
            var value = input[key];

            if(key === keyKey){
                continue;
            }

            if(isInstance(value)){
                output[key] = scan(value);
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