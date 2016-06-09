'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Album Schema
 */
var AlbumSchema = new Schema({
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
    name: {
        type: String,
        trim: true,
        required: 'Name cannot be blank'
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
    }]
});

mongoose.model('Album', AlbumSchema);
