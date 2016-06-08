'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
var doc = require('./../controllers/doc.server.controller');
module.exports = function (app) {
    // Routes
    app.route('/:groupId/docs/post').post(user.logIn, user.requiresLogin, group.isGroupAdmin, doc.addDoc);

    app.route('/:groupId/docs').post(user.logIn, user.requiresLogin, doc.getDocs); // can use get here

    // Binding the group middleware
    app.param('groupId', group.getGroup);
};