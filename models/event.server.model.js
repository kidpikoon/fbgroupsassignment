'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
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
    endDate: {
        type: Date,
        required: 'End Date cannot be blank'
    },
    updated: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Name cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true,
        required: 'Description cannot be blank'
    },
    coverPhoto : {
        type: String,
        trim: true,
        required: 'Cover Photo cannot be blank',
        match: [/^http(?:s?):\/\/.*\..*/, 'Please fill a valid icon URL']
    },
    interestedCount: {
        type: Number,
        default: 0
    },
    declineCount: {
        type: Number,
        default: 0
    },
    maybeCount: {
        type: Number,
        default: 0
    },
});

mongoose.model('Event', EventSchema);
