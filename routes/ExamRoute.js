const express=require('express');
const questionModel=require('../models/questionModel');
const ExamRoute=express.Router();
const uuid4=require('uuid4');
const userModel=require('../models/userModel');
const testSeriesModel=require('../models/testSeriesModel');

const _=require('lodash');
const resultModel=require('../models/resultModel');
const feedbackModel=require('../models/feedbackModel');
ExamRoute
    // .get('/profile', async (req, res) => {
    //     try {
    //         let user = await userModel.findOne({ _id: req.user.id })
    //         const { name, email, username, photo, collegeName, graduationYear, createdAt } = user
    //         return res.json({ name, email, username, photo, collegeName, graduationYear, joined: createdAt })
    //     } catch (error) {
    //         return res.json("redirect to login")
    //     }
    // })
    .get('/success', (req, res) => {
        return res.render('testSubmitted')
    })
    .post('/feedback', async (req, res) => {
        let feedback=req.body;
        let fb_rating=feedback.rating||"";
        let fb_msg=feedback.message||"";
        let data={
            "userid": req.user.id,
            "rating": fb_rating,
            "message": fb_msg
        }
        // console.log(data);
        let feedbackSave=new feedbackModel(data);
        await feedbackSave.save();
        return res.redirect('/dashboard')
    })
    .post('/submittest', async (req, res) => {
        try {
            let userSubmission=JSON.parse(req.body.selectedAnswers)
            let allquestions=await questionModel.find({ subjectId: req.body.seriesId })
            let analysis={
                "userid": req.user.id,
                "testid": req.body.testId,
                "testseriesid": req.body.seriesId,
                "subjectid": req.body.subjectId,
                "resultmeta": [],
                "score": 0
            }
            allquestions.forEach((element) => {
                for (let i=0; i<userSubmission.length; i++) {
                    if ((element._id).toString()==userSubmission[i].id) {
                        resultmeta={
                            quesid: userSubmission[i].id,
                            userchoice: userSubmission[i].choice
                        }
                        if ((element.correctAnswer==userSubmission[i].choice)) {
                            resultmeta.outcome=1
                            analysis.resultmeta.push(resultmeta);
                            analysis.score+=1
                        } else {
                            resultmeta.outcome=0
                            analysis.resultmeta.push(resultmeta)
                        }
                    }
                }
            });
            let accuracyCal=analysis.score/allquestions.length*100
            analysis.accuracy=accuracyCal.toFixed(2);
            let { testStartTime }=await userModel.findById({ _id: req.user.id })
            let now=new Date();
            let timeTakenCal=now-testStartTime
            var _second=1000;
            var _minute=_second*60;
            var _hour=_minute*60;
            var minutes=Math.ceil((timeTakenCal%_hour)/_minute);
            analysis.timetaken=minutes
            // update user db
            let update={
                $set: {
                    currentTestId: null,
                    isTestOn: false,
                    testStartTime: null,
                    currentTestSeriesId: null,
                }
            };
            await userModel.updateMany({ _id: req.user.id }, update);
            let result=new resultModel(analysis);
            result.save()
            return res.status(200).json(analysis)
        } catch (error) {
            return res.status(404).json("error")
        }

    })
    .get('/start/:seriesId', async (req, res) => {
        let testId=uuid4();
        let seriesId=req.params.seriesId
        let series=await testSeriesModel.find({ _id: seriesId })
            .populate('category');
        let { isTestOn, currentTestSeriesId, currentTestId }=await userModel.findById({ _id: req.user.id })
        if (isTestOn) {
            return res.json(`complete or submit previous test first before proceeding for the new one! http://localhost:3000/exam/${currentTestSeriesId}/${currentTestId}`)
        }
        data={
            title: "Exam Instructions",
            testId,
            series
        }
        return res.render('pre_exam_info', {
            data
        })
    })

    .get('/exam/:seriesId/:testId', async (req, res) => {
        let user=req.user.id;
        let oldResult=await resultModel.findOne({ testid: req.params.testId })
        if (oldResult) {
            return res.send("Either the test is already complete or expired! try again")
        }
        let { isTestOn }=await userModel.findById({ _id: user })
        let now=new Date();
        if (!isTestOn) {
            let update={
                $set: {
                    currentTestId: req.params.testId,
                    isTestOn: true,
                    testStartTime: now,
                    currentTestSeriesId: req.params.seriesId,
                }
            };
            await userModel.updateMany({ _id: user }, update)
        }
        let { currentTestSeriesId, testStartTime, name }=await userModel.findById({ _id: user })
        let subject=await testSeriesModel.findOne({ _id: currentTestSeriesId })
        testStartTime.setMinutes(testStartTime.getMinutes()+parseInt(subject.totalTime));
        let question=await questionModel.find({ subjectId: currentTestSeriesId })
        const questionData=question.map((e) => {
            let formattedQues={
                questionId: e._id,
                subjectId: e.subjectId,
            }
            return formattedQues
        })

        let formattedFirstQues={
            questionId: question[0]._id,
            question: question[0].title,
            seriesId: question[0].subjectId,
            subjectId: subject.category,
            hidden: question[0].hidden,
            options: question[0].incorrectOptions
        }
        // console.log(formattedFirstQues)
        let anschoice=_.random(1, 4);
        formattedFirstQues.options.splice(anschoice-1, 0, question[0].correctAnswer)

        res.render('test', { firstdata: formattedFirstQues, total: question.length, moreQuestion: questionData, testId: req.params.testId, seriesId: req.params.seriesId, subjectTitle: subject.title, timer: testStartTime, name });
    });
// ExamRoute.post('/fetch', (req, res) => {
//     console.log(req.body)
//     const result = new resultModel(req.body);
//     result.save();

//  res.end("sUCCESS")
// })

module.exports=ExamRoute