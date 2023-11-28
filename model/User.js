const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        immutable: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,

    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }

});

module.exports = new mongoose.model('user',UserSchema);