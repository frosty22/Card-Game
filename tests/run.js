/**
 * Simple test's case with all tests.
 * @author Vít Ledvinka | frosty22
 */

console.log(new Date() + " Run tests");

/**
 * Base assertion tool.
 * @type {*}
 */
var assert = require("assert");

/**
 * Container test.
 */
var Container = require("./../libs/container.js");

var testContainer = new Container();
assert.strictEqual(testContainer.getParam("foo"), undefined, "Bad return undefined when get undefined parameter.");
testContainer.setParam("bar", "foo");
assert.strictEqual(testContainer.getParam("bar"), "foo", "Bad return of defined parameter.");

var foo = new Date();
testContainer.addService("foo", foo);
assert.equal(testContainer.hasService("bar"), false);
assert.equal(testContainer.hasService("foo"), true);
assert.strictEqual(testContainer.getService("foo"), foo, "Bad store of service.");
assert.throws(function() { testContainer.getService("bar") }, Error, "Undefined service dont throw exception.");

var testContainer2 = new Container();
assert.strictEqual(testContainer2.getParam("bar"), undefined, "Unexcepted return - object must not shared property.");

var testContainer3 = new Container({ foo : "bar" });
assert.strictEqual(testContainer3.getParam("foo"), "bar", "Bad constructor setting of configuration.");

var testContainer4 = new Container();
assert.strictEqual(testContainer4.getParam("foo"), undefined, "Bad constructor setting, doesnt equals shared property.");
assert.strictEqual(testContainer.getParam("foo"), undefined, "Bad constructor setting, doesnt equals shared property.");

testContainer.setParam("arr", new Array());
assert.equal(testContainer.getParam("arr").length, 0);
testContainer.getParam("arr").push("foo");
assert.equal(testContainer.getParam("arr").length, 1);
testContainer.getParam("arr").splice(0, 1);
assert.equal(testContainer.getParam("arr").length, 0);

/**
 * Match test.
 */
var Match = require("./../libs/match.js");
var Player = require("./../libs/player.js");

var match = new Match({ levelMultiply : 10 }, 1);

var player1 = new Player({ life : 100 }, {}, { id : 1, level : 1 });
var player2 = new Player({ life : 100 }, {}, { id : 2, level : 3 });

match.addPlayer(player1);
match.addPlayer(player2);

match.setConnectedPlayer(player1);
assert.equal(match.getConnectedPlayer().id, 1);
assert.equal(match.getOpponentPlayer().id, 2);

match.setConnectedPlayer(player2);
assert.equal(match.getConnectedPlayer().id, 2);
assert.equal(match.getOpponentPlayer().id, 1);
player1.id = 3;
assert.equal(match.getOpponentPlayer().id, 3);

assert.equal(match.getStartError(), null);

match.start();
assert.equal(match.getOpponentPlayer().life, 120);
assert.equal(match.getConnectedPlayer().life, 100);

/**
 * All tests done.
 */
console.log(new Date() + " Tests done");