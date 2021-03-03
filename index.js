const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`Listening on port${port}...`) );

const firebase = require("firebase/app")
require("firebase/firestore")

var config = {
    apiKey: "AIzaSyDUDEe4xAIS2egIxuWEWwbPdPp9ifyA0xE",
    authDomain: "back-e036d.firebaseapp.com",
    databaseURL: "https://back-e036d-default-rtdb.firebaseio.com",
    projectId: "back-e036d",
    storageBucket: "back-e036d.appspot.com",
    messagingSenderId: "449356049325",
    appId: "1:449356049325:web:c65192887db0f30be8cf24",
    measurementId: "G-2ZQP5ZRXBF"   
  };
  firebase.initializeApp(config);
  let firestore = firebase.firestore()

  var cors = require('cors');
const moment = require('moment');

  app.use(cors()) // Use this after the variable declaration

//ดึงค่า profile User รายคนตาม id
app.get('/api/get/user/:doc', (req, res) => {
    firestore.collection("user").doc(req.params.doc).get().then(function(docs){
        res.json(docs.data()); 
    });
});

//ส่งค่า profile เข้าไปใน firebase
app.post('/api/post/user', (req, res) => {
    const user = {
        imgURL:req.body.imgUrl,
        userId:req.body.userId,
        name:req.body.name,
        nickname:req.body.nickname,
        position:req.body.position
    }
    firestore.collection("user").doc(user.userId).set({ 
        imgURL:user.imgURL,
        userId:user.userId,
        name: user.name,
        nickname: user.nickname,
        position: user.position
    });
    res.json(user);
});

//แก้ไข profile
app.put('/api/edit/user/:doc', (req, res) => {
    const edit = {
        name: req.body.name,
        nickname: req.body.nickname,
        position: req.body.position
    }
    firestore.collection("user").doc(req.params.doc).update({ 
        name: edit.name,
        nickname: edit.nickname,
        position: edit.position
    });
        res.json(edit);
    });
     
// เก็บใบลา
app.post('/api/post/leave',async (req,res) => {

    const newLeave = firestore.collection("leave").doc()
    const newLeaveRef = await newLeave.get()
 
    const dbL = {

        userId: req.body.userId,
        leaveType: req.body.leaveType,
        reson: req.body.reson,
        startValue: req.body.startValue,
        endValue: req.body.endValue,
        status: req.body.status,
        dateStart:req.body.dateStart,
        dateEnd:req.body.dateEnd
    }
    await newLeave.set({
        id:newLeaveRef.id,
        userId:dbL.userId,
        leaveType:dbL.leaveType,
        reson:dbL.reson,
        startValue:dbL.startValue,
        endValue:dbL.endValue,
        status:dbL.status,
        dateStart:dbL.dateStart,
        dateEnd:dbL.dateEnd
    })
    res.json(dbL);
});
//get ใบลา ตาม user หน้าstatus user ต้องการ uerId
app.get('/api/get/leaveByUser/:doc', (req, res) => {
    let item = []
    firestore.collection("leave").where("userId","==",req.params.doc).orderBy("status").get().then(function(snapshot){

        snapshot.forEach(function(docs){

            item.push(docs.data())

        });
       res.json(item); 
    });
});
//get ใบให้ hr approve
app.get('/api/get/approve',async (req, res) => {
    let items = []
    firestore.collection("leave").where("status","==","รออนุมัติ").get().then(async function(snapshot){
        snapshot.forEach (function(docs){
            items.push(docs.data());
        });

        await Promise.all(items.map(async item =>{
            await firestore.collection("user").where("userId","==",item.userId).get().then(function (snapshot) {
                snapshot.forEach(function (a) {
                    item["name"] = a.data().name
                    return item
                })
            })
            return item
        }))
       res.json(items); 
    });
});
//update status approve ส่งไอดีของใบลา
app.put('/api/updateStatus/:doc', (req,res) => {
    const approve = {
        status: req.body.status
    }
    firestore.collection("leave").doc(req.params.doc).update({
        status: approve.status
    })
    res.json(approve)
})

//post calendar
app.post('/api/post/calendar', async (req, res) => {
    const newCalendar = firestore.collection("calendar").doc()
    const newCalendarRef = await newCalendar.get()
    const calender = {

        userId: req.body.userId,
        activity: req.body.activity,
        dateActivity: req.body.dateActivity,
        date: req.body.date
    }
    await newCalendar.set({ 
        id: newCalendarRef.id,
        userId: calender.userId,
        activity: calender.activity,
        dateActivity: calender.dateActivity,
        date: calender.date
    });
    res.json(calender);
});

//แก้ไข calendar
app.put('/api/edit/calendar/:doc', (req, res) => {
    const editCalendar = {
        activity: req.body.activity,
        dateActivity: req.body.dateActivity,
        date: req.body.date
    }
    firestore.collection("calendar").doc(req.params.doc).update({ 
        activity: editCalendar.activity,
        dateActivity: editCalendar.dateActivity,
        date: editCalendar.date
    });
    res.json(editCalendar);
});

//get calendar order by date
app.get('/api/get/calendar', (req, res) => {
    const moment = require("moment");
    let item = []
    firestore.collection("calendar").where("date", ">=",moment().format()).orderBy("date").get().then(function(snapshot){
        snapshot.forEach(function(docs){
            item.push(docs.data())
        });
       res.json(item); 
    });
});
//get 1 role calendar
app.get('/api/get/calendar/1/:doc', (req,res) => {
    firestore.collection("calendar").doc(req.params.doc).get().then(function (docs) {
        res.json(docs.data());
    });
});

//delete calendar
app.delete('/api/delete/calendar/:doc', (req, res) => {
    firestore.collection("calendar").doc(req.params.doc).delete()
    res.json();
});

//เก็บ เข้า-ออก
app.post('/api/post/checkIn',async (req, res) => {
    const newCheck = firestore.collection("checkinout").doc()
    const newCheckRef = await newCheck.get()

    const inOut = {
        timeIn:req.body.timeIn,
        timeOut:req.body.timeOut,
        userId:req.body.userId,
        dateShow:req.body.dateShow,
        dateGet:req.body.dateGet
    }
    await newCheck.set({ 
        id:newCheckRef.id,
        timeIn:inOut.timeIn,
        timeOut:inOut.timeOut,
        userId:inOut.userId,
        dateShow:inOut.dateShow,
        dateGet:inOut.dateGet
    });
    res.json(inOut);
});
//get ส่ง userId
app.get('/api/get/check/:doc', (req, res) => {
    const moment = require("moment");
    const dateCheck = moment().format("l");
    const newCheck = firestore.collection("checkinout").where("userId","==",req.params.doc)
    newCheck.where("dateGet","==",dateCheck).get().then(function(snapshot){
            snapshot.forEach(function(docs){
                res.json(docs.data())    
                console.log(docs.data().id);
            });
            res.json(null)
            // console.log("get",newCheck.id);
    //    res.json(item); 
    }); 
});

//update status and timeout
app.put('/api/update/checkout/:doc', (req,res) => {
    const moment = require("moment");
    const dateCheck = moment().format("l");
    let Ref = ""
    const updateOut = {
        timeOut:req.body.timeOut
    }
    const checkOut = firestore.collection("checkinout").where("userId","==",req.params.doc)
    checkOut.where("dateGet","==",dateCheck).get().then(function(snapshot){
        snapshot.forEach(function(docs){    
            Ref = docs.data().id
        }); 
    console.log("ref",Ref);
    firestore.collection("checkinout").doc(Ref).update({
        timeOut:updateOut.timeOut
    });
    res.json(updateOut)
    });
    console.log(Ref);
});