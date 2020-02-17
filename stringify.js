var createKey = require('./createKey'),
    keyKey = createKey(-1),
    isInstance = require('./isInstance');

function toJsonValue(value){
    if(value != null && typeof value === 'object'){
        var result = value instanceof Array ? [] : {},
            output = value;
        if('toJSON' in value){
            output = value.toJSON();
        }
        for(var key in output){
            result[key] = output[key];
        }
        return result;
    }

    return value;
}

function stringify(input, replacer, spacer){
    var objects = [],
        outputObjects = [],
        refs = [];

    function scan(key, input){
        if(!isInstance(input)){
            return replacer ? replacer.call(this, key, input) : input;
        }

        var output,
            index = objects.indexOf(input);

        if(index >= 0){
            outputObjects[index][keyKey] = refs[index]
            return refs[index];
        }

        index = objects.length;
        objects[index] = input;
        output = input;
        if(replacer){
            output = replacer.call(this, key, input);
        }
        output = toJsonValue(output);
        outputObjects[index] = output;
        refs[index] = createKey(index);

        for(var key in output){
            output[key] = scan.call(output, key, output[key])
        }

        return output;
    }

    return JSON.stringify(scan.call(null, '', input), null, spacer);
}

module.exports = stringify;