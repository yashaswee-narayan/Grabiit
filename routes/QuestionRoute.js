const express = require('express');
const { isAdmin, isSignedIn } = require('../helpers/verifyToken');
const question = require('../models/questionModel');
const QuestionRoute = express.Router();
const _ = require('lodash');
QuestionRoute
    .get("/questions", isAdmin, (req, res) => {
        question.find({}, (err, data) => {
            if (!err) {
                return res.json({ questions: data, success: true })
            } else {
                return res.json({ msg: err.message, success: false })
            }
        })
    })
    .post("/question/create/", isAdmin, (req, res) => {
        var Question = new question(req.body)
        Question.save((err, data) => {
            if (!err) {
                return res.json({ msg: `${data.title} created successfully!`, success: true })
            } else {
                return res.json({ msg: err.message, success: false })
            }
        })
    })

//questions with query 
QuestionRoute
    .get("/question", (req, res) => {
        question.findOne({ _id: req.query.s }, (err, data) => {
            if (!err) {
                let formattedQues = {
                    questionId: data._id,
                    question: data.title,
                    subjectId: data.subjectId,
                    hidden: data.hidden,
                    options: data.incorrectOptions
                }
                let anschoice = _.random(1, 4);
                formattedQues.options.splice(anschoice - 1, 0, data.correctAnswer)

                return res.json({ questions: formattedQues, success: true })
            } else {
                return res.json({ msg: err.message, success: false })
            }
        })
    })
// .get("/question", (req, res) => {
//     question.find({ subjectId: req.query.s }, (err, data) => {
//         if (!err) {
//             console.log(data)
//             const questionData = data.map((e) => {
//                 let formattedQues = {
//                     questionId: e._id,
//                     question: e.title,
//                     subjectId: e.subjectId,
//                     hidden: e.hidden,
//                     options: e.incorrectOptions
//                 }
//                 let anschoice = _.random(1, 4);
//                 formattedQues.options.splice(anschoice - 1, 0, e.correctAnswer)
//                 return formattedQues
//             })

//             return res.json({ questions: questionData, success: true })
//         } else {
//             return res.json({ msg: err.message, success: false })
//         }
//     })
// })

module.exports = QuestionRoute