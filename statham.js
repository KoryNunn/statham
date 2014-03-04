var createKey = require('./createKey'),
    clone = require('clone'),
    keyKey = createKey(-1);

function Scanned(){}

function stringify(input, replacer, spacer){
    input = {result: clone(input)};

    var objects = [],
        refs = [];

    function scan(input){
        if(input instanceof Scanned){
            return input;
        }
        var output = new Scanned();
        for(var key in input){
            var value = input[key];

            output[key] = value;

            if(value != null && typeof value === 'object'){
                var index = objects.indexOf(value);

                if(index < 0){
                    index = objects.length;
                    objects[index] = value;
                    value[keyKey] = refs[index] = createKey(index);
                    output[key] = scan(value);
                    continue;
                }

                output[key] = refs[index];
            }
        }
        return output;
    }

    return JSON.stringify(scan(input).result, replacer, spacer);
}

function parse(json, reviver){
    var input = JSON.parse(json, reviver),
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

module.exports = {
    stringify: stringify,
    parse: parse
};