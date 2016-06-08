'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
var album = require('./../controllers/album.server.controller');
module.exports = function (app) {
    // Routes
    app.route('/:groupId/albums/post').post(user.logIn, user.requiresLogin, group.isGroupAdmin, album.addAlbum);

    app.route('/:groupId/albums').post(user.logIn, user.requiresLogin, album.getAlbums); // can use get here

    // Binding the group middleware
    app.param('groupId', group.getGroup);
};