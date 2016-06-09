'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Doc Schema
 */
var DocSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    groupId: {
        type: Schema.ObjectId,
        ref: 'Group'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: '',
        trim: true,
        required: 'Message cannot be blank'
    },
    subject: {
        type: String,
        default: '',
        trim: true,
        required: 'Subject cannot be blank'
    },
    icon : {
        type: String,
        trim: true,
        required: 'Icon cannot be blank',
        match: [/^http(?:s?):\/\/.*\..*/, 'Please fill a valid icon URL']
    }
});

mongoose.model('Doc', DocSchema);
