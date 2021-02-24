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

  var cors = require('cors')

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
        userId:req.body.userId,
        name:req.body.name,
        nickname:req.body.nickname,
        position:req.body.position
    }
    firestore.collection("user").doc(user.userId).set({ 
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

//บันทึกเวลาเข้า-ออก
// let showTimes = 0;
// app.post('/api/post/time', (req, res) => {
//     const time = {
//         id:req,
//         userId:req.body.userId,
//         timeIn:req.body.timeIn,
//         timeOut:req.body.timeOut,
//         date:req.body.date
//     }
//     firestore.collection("checkInOut").doc(time.id).set({ 
//         id:time.id,
//         userId:time.userId,
//         timeIn:time.timeIn,
//         timeOut:time.timeOut,
//         date:time.date
//     });
//     res.json(user);
// });

// เก็บใบลา
app.post('/api/post/leave', async (req,res) => {
    // let size = 0
    // await firestore.collection("leave").get().then(snap => {
    //     size = snap.size
    // })
    const newLeave = firestore.collection("leave").doc();
    // console.log(size);
    const dbL = {
        id: newLeave.key,
        userId: req.body.userId,
        leaveType: req.body.leaveType,
        reson: req.body.reson,
        startValue: req.body.startValue,
        endValue: req.body.endValue,
        status: req.body.status,
        dateStart:req.body.dateStart,
        dateEnd:req.body.dateEnd
    }
    // firestore.collection("leave").doc().set({ 
    newLeave.doc().set({ 
        id:dbL.id,
        userId:dbL.userId,
        leaveType:dbL.leaveType,
        reson:dbL.reson,
        startValue:dbL.startValue,
        endValue:dbL.endValue,
        status:dbL.status,
        dateStart:dbL.dateStart,
        dateEnd:dbL.dateEnd
    });
    res.json(dbL);
});
//get ใบลา ตาม user
app.get('/api/get/leaveByUser/:doc', (req, res) => {
    firestore.collection("leave").where("userId","==",req.params.doc).get().then(function(snapshot){
        // console.log(snapshot.docs.length);
        let item = []
        snapshot.forEach(function(docs){
            // console.log(docs.data());
            const str = docs.data().startValue
            // const date = str.split('T')
            // const D1 = date[0].split('-')
            // const DateS =D1[2]+"/"+D1[1]+"/"+D1[0]
            // console.log(DateS);
            console.log(new Date(docs.data().startValue));
            item.push(docs.data())
            // console.log(docs.data().startValue);
        });
        console.log(item);
    });   
});

//เก็บ เข้า-ออก
app.post('/api/post/inout', (req, res) => {
    const inOut = {
        idtime:"cdcd",
        currentTime:req.body.currentTime,
        // timeOut:req.body.timeOut,
        // userId:req.body.userId,
        currentDate:req.body.currentDate,
    }
    firestore.collection("timeinout").doc(inOut.idtime).set({ 
        idtime:inOut.idtime,
        currentTime:inOut.currentTime,
        // timeOut:inOut.timeOut,
        // userId:inOut.userId,
        currentDate:inOut.currentDate
    });
    res.json(inOut);
});

app.post('/api/post/calendar', async (req, res) => {
    let size = 0
    await firestore.collection("calendar").get().then(snap => {
        size = snap.size
    })
    console.log(size);
    const calender = {
        id: size+1,
        userId: req.body.userId,
        activity: req.body.activity,
        dateActivity: req.body.dateActivity,
        date: req.body.date
    }
    firestore.collection("calendar").doc().set({ 
        id: calender.id,
        userId: calender.userId,
        activity: calender.activity,
        dateActivity: calender.dateActivity,
        date: calender.date
    });
    res.json(calender);
});
