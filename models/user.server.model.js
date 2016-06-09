'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        trim: true,
        unique: 'This Username already exists',
        required: 'Username cannot be blank'
    },
    password: {
        type: String,
        trim: true,
        required: 'Password cannot be blank'
    },
    admin : [{
        type: Schema.ObjectId,
        ref: 'Group'
    }]
});

mongoose.model('User', UserSchema);
