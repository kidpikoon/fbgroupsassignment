'use strict';

/**
 * Module dependencies.
 */

var user = require('./../controllers/user.server.controller');
module.exports = function (app) {
    // Routes
    app.route('/user/signup').post(user.signup);
    app.route('/user/signin').post(user.signin);
    app.route('/user/getdetails').get(user.logIn, user.requiresLogin, user.sendDetails);
};