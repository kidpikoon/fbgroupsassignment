'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
var event = require('./../controllers/event.server.controller');
module.exports = function (app) {
    // Routes
    app.route('/:groupId/events/post').post(user.logIn, user.requiresLogin, group.isGroupAdmin, event.addEvent);

    app.route('/:groupId/events').post(user.logIn, user.requiresLogin, event.getEvents); // can use get here

    // Binding the group middleware
    app.param('groupId', group.getGroup);
};