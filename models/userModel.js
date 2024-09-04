const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars')

const Schema=mongoose.Schema;
const UserSchema=new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: null
    },
    collegeName: {
        type: String,
        default: null
    },
    graduationYear: {
        type: Number,
        default: null
    },
    isTestOn: {
        type: Boolean,
        default: false
    },
    currentTestId: {
        type: String,
        default: null
    },
    currentTestSeriesId: {
        type: Schema.Types.ObjectId,
        ref: 'TestSeries',
        default: null
    },
    testStartTime: {
        type: Date,
        default: null
    },
    pastTestId: [{
        type: String,
        default: null
    }],
}, {
    timestamps: true
});

let storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null, file.fieldname+'-'+uniqueSuffix+'-'+file.originalname)
    }
})
const filefilter=(req, file, cb) => {
    if (file.mimetype==="image/png"||file.mimetype==="image/jpg") {
        cb(null, true);
    } else {

        cb(null, false);
    }
};
//   static functions
UserSchema.statics.uploadedAvatar=multer({ storage: storage, filefilter: filefilter }).single('avatar');
UserSchema.statics.avatarPath=AVATAR_PATH;


module.exports=mongoose.model('User', UserSchema);