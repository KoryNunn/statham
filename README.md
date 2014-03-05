Statham
=======

## What

statham is a layer on top of JSON that handles object references.

It took inspiration from https://github.com/graniteds/jsonr

## Usage

statham.stringify(value, [replacer, spacer])

Grab it:
    var statham = require('statham');

Make something you can't JSON.stringify:

    var myObj = {};

    // Circular reference
    myObj.thing = myObj;

Stringify it:

    var myJsonString = statham.stringify(myObj);

The output looks like:

    {"thing":"","":""}

Then to inflate it:

statham.parse(value, [reviver])

    var inflatedObj = statham.parse(myJsonString);

Which will look like:

    {
        thing: inflatedObj
    }

You can also optionally revive an object that has statham markers in it but calling:

    var legitObject = statham.revive(stathamMarkeredObject);

This is useful when someone else got to the json before you, and did:

    var stathamMarkeredObject = JSON.parse(stathamStringifiedJSON);

Which will work without issue, but still have all the statham markers in it.

## How

statham uses extremely rarely used string characters above \uE000 to mark references.

When it scans an object, if it notices an object referenced in more than one spot,
it will add a reference property () with a key character assigned to it.

On deflation, statham will grab all objects with the  property, and inflate any properties that have it's key with that object.

## Why 'statham'?

stathum is all about references in JSON, Statham is a reference to Jason Statham, cuz he's the most famous Jason I could think of.