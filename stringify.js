var createKey = require('./createKey'),
    keyKey = createKey(-1),
    clone = require('clone');

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

module.exports = stringify;