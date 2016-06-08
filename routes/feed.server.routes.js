'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
var feed = require('./../controllers/feed.server.controller');
module.exports = function (app) {
    // chat Routes
    app.route('/:groupId/feeds/post').post(user.logIn, user.requiresLogin, feed.addFeed);

    app.route('/:groupId/feeds').post(user.logIn, user.requiresLogin, feed.getFeeds); // can use get here

    // Binding the group middleware
    app.param('groupId', group.getGroup);
};