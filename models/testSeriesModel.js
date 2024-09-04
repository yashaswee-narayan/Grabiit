const mongoose = require('mongoose');
const questionModel = require('./questionModel');
const { Schema } = mongoose;
const testSeriesSchema = new Schema({
    title: {
        required: true,
        type: String,
        unique: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'SubjectCategory'
    },
    totalTime: {
        type: Number,
        default: 0
    },
    desc: String,
    hidden: Boolean,
}, {
    timestamps: true,
});
testSeriesSchema.virtual('count', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'subjectId',
    count: true,
    justOne: false,
})


testSeriesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
testSeriesSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
module.exports = mongoose.model('TestSeries', testSeriesSchema);