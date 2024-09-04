const mongoose = require('mongoose');
const { Schema } = mongoose;
const testResultSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testid: {
        type: String,
        required: true
    },
    testseriesid: {
        type: Schema.Types.ObjectId,
        ref: 'TestSeries',
        required: true
    },
    subjectid: {
        type: Schema.Types.ObjectId,
        ref: 'SubjectCategory',
        required: true
    },
    // quesid, userchoice, outcome [array of objects]
    // example:
    //     [
    //         {
    //             "quesid": "6250666180a4cac53d76ef72",
    //             "userchoice": "answer",
    //             "outcome": 1
    //         }
    //     ] 
    resultmeta: [{
        quesid: String,
        userchoice: String,
        outcome: String,
    }],
    score: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    timetaken: {
        type: Number //time taken by user in mins
    },
    hidden: Boolean,
}, {
    timestamps: true,
});

module.exports = mongoose.model('ResultSchema', testResultSchema);