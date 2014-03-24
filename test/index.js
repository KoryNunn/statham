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

    t.ok(Date.now() - start < 100);

});

grape('toJSON', function(t) {
    t.plan(1);

    function Thing(){

    }
    Thing.prototype.toJSON = function(){
        return {c:3};
    };

    var thing = new Thing();
    thing.thing = thing;

    t.deepEqual(statham.parse(statham.stringify(thing)), JSON.parse(JSON.stringify(thing)));
});

grape('revive', function(t) {
    t.plan(2);

    var thing = {};
    thing.thing = thing;

    var stringified = statham.stringify(thing);

    var markered = JSON.parse(stringified);

    var revived = statham.revive(markered);

    t.ok(revived);
    t.ok(revived.thing === revived);
});

grape('revive already revived', function(t) {
    t.plan(2);

    var thing = {};
    thing.thing = thing;

    var stringified = statham.stringify(thing);

    var markered = JSON.parse(stringified);

    var revived = statham.revive(markered);

    var doubleRevived = statham.revive(revived);

    t.ok(doubleRevived);
    t.ok(doubleRevived.thing === doubleRevived);
});

grape('revive referenced obj', function(t) {
    t.plan(4);

    var thing = {};
    thing.thing = thing;

    var revivedThing = statham.revive(thing);

    t.ok(revivedThing);
    t.ok(revivedThing.thing === revivedThing);

    var stuff = {};
    stuff.thing = {
        stuff: stuff
    };

    var revivedStuff = statham.revive(stuff);

    t.ok(revivedStuff);
    t.ok(revivedStuff.thing.stuff === revivedStuff);
});