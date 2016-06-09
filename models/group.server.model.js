'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
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
    }
});

mongoose.model('Group', GroupSchema);
