'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
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
    link : {
        type: String,
        trim: true,
        match: [/^http(?:s?):\/\/.*\..*/, 'Please fill a valid URL']
    }
});

mongoose.model('Feed', FeedSchema);
