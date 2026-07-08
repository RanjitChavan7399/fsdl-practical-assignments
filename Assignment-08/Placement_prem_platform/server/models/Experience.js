const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, 'Please add a company name'],
            trim: true,
        },
        aptitudeQuestions: {
            type: String,
            required: true,
        },
        codingQuestions: {
            type: String,
            required: true,
        },
        hrQuestions: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Experience', experienceSchema);
