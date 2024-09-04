const mongoose=require('mongoose');
const { Schema }=mongoose;
const feedbackSchema=new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: String,
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports=mongoose.model('Feedback', feedbackSchema);