var createKey = require('./createKey'),
    keyKey = createKey(-1),
    isInstance = require('./isInstance');

function revive(input){
    var objects = {},
        scannedInputObjects = [];
        scannedOutputObjects = [];

    function scan(input){
        var output = input;

        if(!isInstance(output)){
            return output;
        }

        if(scannedOutputObjects.indexOf(input) < 0){

            // The only way a function got here is if it was returned from a reviver.
            // Just use the passed function, as they cant be cloned.
            output = input instanceof Array ? [] : typeof input === 'function' ? input : {};
            scannedOutputObjects.push(output);
            scannedInputObjects.push(input);
        }


        if(input[keyKey]){
            objects[input[keyKey]] = output;
        }

        for(var key in input){
            var value = input[key];

            if(key === keyKey){
                continue;
            }

            if(isInstance(value)){
                var objectIndex = scannedInputObjects.indexOf(value);
                if(objectIndex<0){
                    output[key] = scan(value);
                }else{
                    output[key] = scannedOutputObjects[objectIndex];
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

    return scan(input);
}

module.exports = revive;