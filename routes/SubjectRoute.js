const express = require('express');
const subjectCategoryModel = require('../models/subjectCategoryModel');
const SubjectRoute = express.Router();
const testSeriesModel = require('../models/testSeriesModel');

SubjectRoute
    .get("/subject", async (req, res) => {
        data = {
            title: 'Home | Grabitt',
            isLoggedIn: false
        }
        if (req.cookies.token) {
            data.isLoggedIn = true;
        }
        try {
            let aptitude = await testSeriesModel.find({
                category: '624f00ffd864bf25802c6042'
            }).populate(
                "count"
            );
            let core = await testSeriesModel.find({
                category: '624f0114d864bf25802c6044'
            }).populate(
                "count"
            );
            let dsa = await testSeriesModel.find({
                category: '624f011bd864bf25802c6046'
            }).populate(
                "count"
            );
            let verbal = await testSeriesModel.find({
                category: '624f0130d864bf25802c6048'
            }).populate(
                "count"
            );
            return res.render('courses', {
                data,
                aptitude,
                core,
                dsa,
                verbal,
                success: true
            });
        } catch (error) {
            return res.json({ msg: error, success: false })
        }
    })
    .post("/subjectCategory/create/", (req, res) => {
        req.body.hidden = req.body.hidden ? 1 : 0
        var SubjectCategory = new subjectCategory(req.body)
        SubjectCategory.save((err, data) => {
            if (!err) {
                return res.json({ msg: `${data.title} created successfully!`, success: true })
            } else {
                return res.json({ msg: err.message, success: false })
            }
        })
    })

SubjectRoute
// .get("/testseries", async (req, res) => {
//     const products = await testSeriesModel.find({
//         category: '624f00ffd864bf25802c6042'
//     }).populate(
//         "count"
//     );

//     return res.json(products)
//     // testSeriesModel.find({}, (err, data) => {
//     //     if (!err) {
//     //         return res.json({ subjects: data, success: true })
//     //     } else {
//     //         return res.json({ msg: err.message, success: false })
//     //     }
//     // })
// })

module.exports = SubjectRoute