'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
module.exports = function (app) {
    // Routes
    app.route('/group').post(user.logIn, user.requiresLogin, group.addGroup);

    app.route('/:groupId/admin').post(user.logIn, user.requiresLogin, group.isGroupAdmin, group.addAdmin);

    // Binding the group middleware
    app.param('groupId', group.getGroup);
};