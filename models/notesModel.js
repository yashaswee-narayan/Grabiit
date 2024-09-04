const mongoose=require('mongoose');
const { Schema }=mongoose;
const notesSchema=new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: [{
        title: String,
        completed: Boolean
    }],
    hidden: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

module.exports=mongoose.model('Notes', notesSchema);