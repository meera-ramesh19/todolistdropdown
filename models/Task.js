const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const TaskSchema = new mongoose.Schema({
    userid: {
        type: Number,
        index: true,
        required: true
    },
    name: {
        type: String,
        index: true,
        required: true
    },
    category: {
        type: String,
        index: true,
        required: true
    },
    description: {
        type: String,
        index: true,
        required: true
    },
    deadline: {
        type: Date,
        required: true,
        // min: -5000,
        // max: (new Date.now)
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

mongoose.model('tasks', TaskSchema);
// module.exports = Task;