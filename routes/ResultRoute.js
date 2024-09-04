const express=require('express');
const ResultRoute=express.Router();
const resultModel=require('../models/resultModel');
const questionModel=require('../models/questionModel')
const userModel=require('../models/userModel');
const testSeriesModel=require('../models/testSeriesModel');

ResultRoute.get('/viewresult', async (req, res) => {
    let user=await req.user.id;
    let currentUser=await userModel.find({ _id: user });
    let userName=currentUser[0].name


    let testTakenList=await resultModel.find({ userid: user })
        .sort('-createdAt')
        .populate('userid')
        .populate('testseriesid')
        .populate('subjectid')


    let dateList=[]
    let List=[]

    testTakenList.forEach(element => {
        let date=new Date(element.createdAt).toLocaleDateString('en-us', { day: 'numeric' })
        let month=new Date(element.createdAt).toLocaleDateString('en-us', { month: 'numeric' })
        let year=new Date(element.createdAt).toLocaleDateString('en-us', { year: 'numeric' })
        const FormattedDate=`${date}/${month}/${year}`
        dateList.push(FormattedDate);

        List.push(element.testseriesid._id)

    });

    // console.log("testTakenList", List);
    let len=[];
    let allquestions=[]

    // List.map(async item => {
    //     allquestions = await questionModel.find({ subjectId: item })
    //     console.log(allquestions.length);
    //     return len.push(allquestions.length)
    // })

    const countQuestions=await Promise.all(
        List.map(async item => {
            let { count }=await testSeriesModel.findOne({ _id: item })
                .populate(
                    "count"
                )
            return count
        })
    )
    data={
        title: "View Result",
        role: req.user.role
    }
    res.render('admin/view_result', {
        testTakenList: testTakenList,
        userName: userName,
        countQuestions,
        dateList: dateList
    });
})


ResultRoute.get('/result/:id', async (req, res) => {
    let id=req.params.id

    let result=await resultModel.find({ _id: id })
        .sort('-createdAt')
        .populate('userid')
        .populate('testseriesid')
        .populate('subjectid')

    if (result) {
        var quesidList=[];
        var choiceList=[];
        var outcomeList=[];
        let element=result[0].resultmeta;


        let allquestions=await questionModel.find({ subjectId: result[0].testseriesid._id })
        quesidList=element.map(item => {
            if (item.quesid&&item.userchoice!='')
                return item.quesid
        })
        // console.log(quesidList)
        let i=0;

        let choiceBucket=[]
        let outcomeBucket=[]

        choiceList=element.map(item => item.userchoice)
        outcomeList=element.map(item => item.outcome)

        allquestions.forEach(element => {
            if (i<quesidList.length) {
                if (element._id==quesidList[i]) {

                    choiceBucket.push(choiceList[i])
                    outcomeBucket.push(outcomeList[i])
                    i++;
                }
                else {
                    choiceBucket.push(`<p class="design">Unanswered</p>`);
                    outcomeBucket.push(`0`);
                }

            }
        });

        // console.log(choiceBucket)

        let data={

            testSeries: result[0].testseriesid,
            subject: result[0].subjectid,

            allquestions: allquestions,

            choiceList: choiceBucket,
            outcomeList: outcomeBucket,
            others: result[0],
            role: req.user.role
        }

        return res.render('admin/result', { data });

    }
    else {
        return res.end('Wrong id');
    }

})
module.exports=ResultRoute;