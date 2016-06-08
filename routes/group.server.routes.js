'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
var group = require('./../controllers/group.server.controller');
module.exports = function (app) {
    // chat Routes
    app.route('/group').post(user.logIn, user.requiresLogin, group.addGroup);
};