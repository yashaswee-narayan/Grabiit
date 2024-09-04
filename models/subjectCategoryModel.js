const mongoose = require('mongoose');
const { Schema } = mongoose;
const subjectCategorySchema = new Schema({
    title: {
        required: true,
        type: String,
        unique: true
    },
    desc: String,
    hidden: Boolean,
}, {
    timestamps: true,
});

module.exports = mongoose.model('SubjectCategory', subjectCategorySchema);