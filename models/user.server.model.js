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
    description: {
        type: String,
        trim: true,
        required: 'Description cannot be blank'
    },
    privacy: {
        type: String,
        trim: true,
        enum : ['private', 'public'],
        required: 'Name cannot be blank'
    },
    links : [{
        type: String,
        trim: true,
        match: [/^http(?:s?):\/\/.*\..*/, 'Please fill valid URLs']
    }],
    admin : [{
        type: Schema.ObjectId,
        ref: 'Group'
    }]
});

mongoose.model('User', UserSchema);
