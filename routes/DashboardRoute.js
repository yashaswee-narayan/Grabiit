const express=require('express');
const userModel=require('../models/userModel');
const DashboardRoute=express.Router();
const resultModel=require('../models/resultModel');
const fs=require('fs')
const path=require('path');
const notesModel=require('../models/notesModel');
const testseriesModel=require('../models/testSeriesModel')

const mongoose=require('mongoose');
// ProfileRoute
//     .get('/profile', async (req, res) => {
//         try {
//             let user = await userModel.findOne({ _id: req.user.id })
//             const { name, email, username, photo, collegeName, graduationYear, createdAt } = user
//             return res.json({ name, email, username, photo, collegeName, graduationYear, joined: createdAt })
//         } catch (error) {
//             return res.json("redirect to login")
//         }
//     })

DashboardRoute
    .get('/dashboard', async (req, res) => {
        let user=await userModel.findOne({ _id: req.user.id });
        const { name, email, username, photo, collegeName, graduationYear, createdAt, avatar }=user;
        let totalTestCount=await resultModel.countDocuments({ userid: req.user.id });
        let notes=await notesModel.findOne({ userid: req.user.id })

        let results=await resultModel.find({ userid: req.user.id });

        let distinct=function (arr) {
            let newArray=[];
            let uniqueObject={};

            for (let i in arr) {

                objTitle=arr[i]['testseriesid'];

                uniqueObject[objTitle]=arr[i];
            }

            for (i in uniqueObject) {
                newArray.push(uniqueObject[i]);
            }

            return newArray
        }

        let newArray=[]
        if (results) {
            newArray=distinct(results)
        }

        let returnLarger=(arr, num) => {
            return arr.map(v => v.accuracy>=num? v:"").filter(Boolean)
        }

        getBadgeTests=returnLarger(results, 80)

        let verbal=await testseriesModel.find({ category: "624f0130d864bf25802c6048" });
        let dsa=await testseriesModel.find({ category: "624f011bd864bf25802c6046" });
        let core=await testseriesModel.find({ category: "624f0114d864bf25802c6044" });
        let aptitude=await testseriesModel.find({ category: "624f00ffd864bf25802c6042" });

        let badge=[];
        let getBadge=function (arr) {
            let c=0;
            for (let i=0; i<arr.length; i++) {
                for (let j=0; j<getBadgeTests.length; j++) {
                    if (arr[i].id==getBadgeTests[j].testseriesid) {
                        c++;
                        break;
                    }
                }
            }

            if (c==arr.length) {
                badge.push(1);
            }
            else {
                badge.push(0)
            }

            return badge;
        }

        getBadge(aptitude);
        getBadge(core)
        getBadge(dsa)
        badge=getBadge(verbal)


        let l_aptitude=0;
        let l_dsa=0;
        let l_core=0;
        let l_verbal=0;
        let sum_ap=0;
        let sum_dsa=0;
        let sum_core=0;
        let sum_v=0;
        let final_accuracy=0;
        let final_ap=0;
        let final_dsa=0;
        let final_core=0;
        let final_v=0;

        if (newArray.length!=0) {
            newArray.forEach(item => {
                if (item.subjectid=='624f00ffd864bf25802c6042') {
                    l_aptitude++;
                    sum_ap+=item.accuracy;
                }
                else if (item.subjectid=='624f011bd864bf25802c6046') {
                    l_dsa++;
                    sum_core+=item.accuracy;
                }
                else if (item.subjectid=='624f0114d864bf25802c6044') {
                    l_core++;
                    sum_dsa+=item.accuracy;
                }
                else {
                    l_verbal++;
                    sum_v+=item.accuracy;
                }


            })

            final_accuracy=((sum_ap+sum_core+sum_dsa+sum_v)/newArray.length).toFixed(2);
            final_ap=(sum_ap/l_aptitude).toFixed(2);
            final_dsa=(sum_dsa/l_dsa).toFixed(2);
            final_core=(sum_core/l_core).toFixed(2);
            final_v=(sum_v/l_verbal).toFixed(2);

        }

        const data={
            title: 'Dashboard',
            name,
            email,
            username,
            avatar,
            collegeName,
            graduationYear,
            createdAt,
            totalTestCount,
            notes,
            final_accuracy,
            final_ap,
            final_core,
            final_dsa,
            final_v,
            badge,
            role: req.user.role
        }
        return res.render('admin/user_dashboard', { data });
    })

DashboardRoute.get('/edit-profile', async (req, res) => {

    let user=await userModel.findOne({ _id: req.user.id });
    let data={
        title: 'Edit Profile',
        user: user,
        role: req.user.role
    }
    return res.render('admin/editProfile', { data });
})

DashboardRoute.post('/edit-profile/update-info', async (req, res) => {

    let user=await userModel.findById(req.user.id)
    userModel.uploadedAvatar(req, res, (err) => {
        if (err) {
            console.log("Multer error");
            return res.redirect('back');
        }

        user.name=req.body.name
        // user.email = req.body.email
        user.username=req.body.username
        user.collegeName=req.body.collegeName
        user.graduationYear=req.body.graduationYear

        // console.log(req.file)
        if (req.file) {
            if (user.avatar) {
                fs.unlinkSync(path.join(__dirname, '..', user.avatar));
            }
            user.avatar=userModel.avatarPath+'/'+req.file.filename

            res.clearCookie('avatar', { path: '/' });
            res.cookie('avatar', user.avatar)
        }
        user.save((err, data) => {
            if (!err) {
                res.clearCookie('name', { path: '/' });
                res.cookie('name', user.name)
                return res.redirect('back');
            } else {
                return res.json({ msg: err.message, success: false })
            }
        })

    })
    //    let user = userModel.findById(req.user.id)
    //         user.name = req.body.name
    //         user.email = req.body.email
    //         user.username = req.body.username
    //         user.collegeName = req.body.collegeName
    //         user.graduationYear = req.body.graduationYear



    //         user.save();
    //         return res.redirect('back');

})
DashboardRoute.post('/note/add', async (req, res) => {
    let user=req.user.id;
    let title=req.body.todo_data

    let note=await notesModel.findOne({ userid: user })
    let data={
        userid: user,
        notes: {
            title: title,
            completed: 0
        }
    }
    if (!note) {
        let addNote=new notesModel(data)
        await addNote.save()
    } else {
        let notes={
            title: title,
            completed: 0
        }
        note.notes.push(notes);
        note.save();
    }

    return res.redirect('/dashboard')
})
DashboardRoute.post('/note/update', async (req, res) => {
    await notesModel.findOneAndUpdate({ notes: { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.noteId) } } }, {
        '$set': {
            'notes.$.completed': req.body.completed
        }
    })

    return res.json("done")
})
DashboardRoute.post('/note/delete', async (req, res) => {
    let note=await notesModel.findOneAndUpdate({ notes: { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.noteId) } } }, {
        $pull: {
            notes: { _id: mongoose.Types.ObjectId(req.body.noteId) }
        }
    }, { multi: true })

    if (note) {
        return res.redirect('/dashboard')
    }


})
module.exports=DashboardRoute