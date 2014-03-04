var grape = require('grape'),
    util = require('util'),
    statham = require('../statham');

grape('statham', function(t) {
    t.plan(1);

    var thing = {},
        stuff = {
            a:1,
            b:2
        };

    thing.thing = thing;
    thing.stuff = stuff;
    thing.what = stuff;

    t.equal(util.inspect(statham.parse(statham.stringify(thing))), util.inspect(thing));
});

grape('speed', function(t) {
    t.plan(1);

    var thing = [],
        stuff = {
            hello: 'world'
        }

    for(var i = 0; i < 10000; i++){
        thing[i] = stuff;
    }

    var start = Date.now();

    statham.parse(statham.stringify(thing));

    console.log(Date.now() - start);

    t.ok(Date.now() - start < 100);

});