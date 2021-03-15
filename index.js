const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3303
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

// var cors = require('cors');
const cors = require('cors')({
    origin: true
  });
  
  exports.hellofirebase = functions.https.onRequest((req, res) => {
    cors((req, res, () => {
      res.send("Hello Firebase Cloud Function!");
    }));
  });

const moment = require('moment');
const { urlencoded } = require('express');

app.use(cors()) // Use this after the variable declaration

//ดึงค่า profile User รายคนตาม id
app.get('/api/get/user/:doc', (req, res) => {
    firestore.collection("user").doc(req.params.doc).get().then(function(docs){
        if(docs.data()){
            res.json(docs.data()); 
        }
        res.json(null)
    });
});

//ส่งค่า profile เข้าไปใน firebase
app.post('/api/post/user', (req, res) => {
    const user = {

        userId:req.body.userId,
        name:req.body.name,
        nickname:req.body.nickname,
        position:req.body.position,
        rank:req.body.rank
    }
    firestore.collection("user").doc(user.userId).set({ 

        userId:user.userId,
        name: user.name,
        nickname: user.nickname,
        position: user.position,
        rank:user.rank
    });
    res.json(user);
});

//api user hr
app.post('/api/post/user/hr', (req, res) => {
    const user = {

        userId:req.body.userId,
        name:req.body.name,
        nickname:req.body.nickname,
        position:req.body.nickname,
        rank:"Human Resource (HR)"
    }
    firestore.collection("user").doc(user.userId).set({ 

        userId:user.userId,
        name: user.name,
        nickname: user.nickname,
        position: user.position,
        rank:user.rank
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
     
//แก้ไข proflie hr
// app.put('/api/edit/user/hr/:doc', (req, res) => {
//     const edit = {
//         name: req.body.name,
//         nickname: req.body.nickname,
//         position: req.body.position
//     }
//     firestore.collection("user").doc(req.params.doc).update({ 
//         name: edit.name,
//         nickname: edit.nickname,
//         position: edit.position
//     });
//         res.json(edit);
// });

// เก็บใบลา
app.post('/api/post/leave',async (req,res) => {

    const newLeave = firestore.collection("leave").doc()
    const newLeaveRef = await newLeave.get()
    let idHr = []
    const hr = await firestore.collection('user').where('rank','==','Human Resource (HR)')
    const LINE_MESSAGING_API_USER = 'https://api.line.me/v2/bot/message/push';
    const LINE_HEADER_USER = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {dCibnFNR1wHpjpqf51ArFk+4bsUShozYw3QIFr0U1r2adBk+/aNGSdm738J6qqGt5elkLO4eBwlTZz0jdD40+rAG42fLo9sD8Mhb4YLpxNDD80OLTeQlWo8FAvJxald9klaVQ5ei/a9aDKPcLavD5AdB04t89/1O/w1cDnyilFU=}`
      };
    const LINE_MESSAGING_API_HR = 'https://api.line.me/v2/bot/message/multicast';
    const LINE_HEADER_HR = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer {l/MKxHe5xVT1oqZd2/1Bnr7bcR3HTtEXvwlrcfasdzU+I0xfAkb6zpFd8TYuurWXx7/CYuU6fAkMshGXKzgDNvYiHFQPXm+PX6GyTBVqc4SEpMBfiP3i7XRXIYY41qGZTyE6JC+7rP36BijepfhP6AdB04t89/1O/w1cDnyilFU=}`
    };
    await hr.get().then(async function (snap) {
        await snap.forEach(function (u) {
            idHr.push(u.data().userId)
            console.log(idHr);
            return idHr
        });
    })
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
    }),
    request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API_HR}`,
        headers: LINE_HEADER_HR,
        body: JSON.stringify({
        //   to: "Ud7876758fece09a64eee8d3b1030fe76",
        to: idHr,
          messages: [{
              type: "text",
              text: "You have a new message about a request for leave."
          }]
          })
      });
      request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API_USER}`,
        headers: LINE_HEADER_USER,
        body: JSON.stringify({
          to: dbL.userId,
        // to: idHr,
          messages: [{
              type: "text",
              text: "You send a request for leave Successfully"
          }]
          })
      });
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
app.put('/api/updateStatus/:doc',async (req,res) => {
    let idUser = ""
    const LINE_MESSAGING_API_USER = 'https://api.line.me/v2/bot/message/push';
    const LINE_HEADER_USER = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {dCibnFNR1wHpjpqf51ArFk+4bsUShozYw3QIFr0U1r2adBk+/aNGSdm738J6qqGt5elkLO4eBwlTZz0jdD40+rAG42fLo9sD8Mhb4YLpxNDD80OLTeQlWo8FAvJxald9klaVQ5ei/a9aDKPcLavD5AdB04t89/1O/w1cDnyilFU=}`
      };
    const approve = {
        status: req.body.status
    }
    await firestore.collection("leave").doc(req.params.doc).update({
        status: approve.status
    })
    
    await firestore.collection("leave").doc(req.params.doc).get().then(function(docs){
        idUser = docs.data().userId
        console.log(idUser);
    })
    console.log(idUser);
    request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API_USER}`,
        headers: LINE_HEADER_USER,
        body: JSON.stringify({
          to: idUser,
        // to: idHr,
          messages: [{
              type: "text",
              text: "The status of your leave request is updated."
          }]
          })
      });
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
    const staff = await firestore.collection('user').where('rank','==','Staff')
    let idStaff = []
    const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/multicast';
    const LINE_HEADER = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {dCibnFNR1wHpjpqf51ArFk+4bsUShozYw3QIFr0U1r2adBk+/aNGSdm738J6qqGt5elkLO4eBwlTZz0jdD40+rAG42fLo9sD8Mhb4YLpxNDD80OLTeQlWo8FAvJxald9klaVQ5ei/a9aDKPcLavD5AdB04t89/1O/w1cDnyilFU=}`
      };
    
    await staff.get().then(async function (snap) {
        await snap.forEach(function (u) {
            idStaff.push(u.data().userId)
            // console.log(idStaff);
            return idStaff
        });
    })
    console.log(idStaff);
    request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}`,
        headers: LINE_HEADER,
        body: JSON.stringify({
        //   to: "Ud7876758fece09a64eee8d3b1030fe76",
        to: idStaff,
          messages: [{
              type: "text",
              text: "A new event the calendar."
          }]
          })
      });
    //   console.log(idStaff);
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
    }); 
});

//update status and timeout
app.put('/api/update/checkout/:doc',async (req,res) => {
    // const moment = require("moment");
    // const dateCheck = moment().format("l");
    let Ref = ""
    const updateOut = {
        timeOut:req.body.timeOut
    }
    const checkOut = await firestore.collection("checkinout").where("userId","==",req.params.doc)

    // checkOut.where("dateGet","==",dateCheck).get().then(function(snapshot){
    //     snapshot.forEach(function(docs){    
    //         Ref = docs.data().id
    //     }); 
    // // console.log("ref",Ref);
    // firestore.collection("checkinout").doc(Ref).update({
    //     timeOut:updateOut.timeOut
    // });
    // res.json(updateOut)
    // });
    // console.log(Ref);
    await checkOut.get().then(function(snapshot){
        snapshot.forEach(function(docs){ 
            if(docs.data().checkOut == ""){
                Ref = docs.data().id
            } 
        }); 
    await firestore.collection("checkinout").doc(Ref).update({
        timeOut:updateOut.timeOut
    });
    res.json(updateOut)
    });
});
//get roport chack in out รายปี
app.get('/api/get/report/chackinout/',async (req,res) =>{
    let items = []
    const dbCheck = firestore.collection("checkinout")
    let y21 = moment("20210101").format(); // 2021-01-01T00:00:00+07:00
    let y22 = moment("20220101").format(); // 2022-01-01T00:00:00+07:00
    dbCheck.where("dateShow",">=",y21).where("dateShow","<",y22)
    .orderBy("dateShow").orderBy("userId")
    .get().then(async function (snapshot) {
        snapshot.forEach(function (docs) {
            items.push(docs.data())
        })

        await Promise.all(items.map(async item =>{
            await firestore.collection("user").where("userId","==",item.userId).get().then(function (snapshot) {
                snapshot.forEach(function (a) {
                    item["name"] = a.data().name
                    item["position"] = a.data().position
                    return item
                })
            })
        return item
        })),res.json(items)
    });
});

////
app.get('/report/month', (req,res) =>{
    let items = []
    let m = moment("20210101") // 2021-01-01T00:00:00+07:00
    let mNow = ""
    let mBack = ""
    const monthRef = {
        mm:req.body.mm
    }
    const db = firestore.collection("checkinout")
    db.get().then(function () {
            switch (monthRef.mm) {
                case 'มกราคม':
                    mNow = m.format(),
                    mBack = m.add(1, 'month').format();
                    break;
                case 'กุมภาพันธ์':
                    mNow = m.add(1, 'month').format(),
                    mBack = m.add(2, 'month').format();
                    break;
                case 'มีนาคม':
                    mNow = m.add(2, 'month').format(),
                    mBack = m.add(3, 'month').format();
                    break;
                case 'เมษายน':
                    mNow = m.add(3, 'month').format(),
                    mBack = m.add(4, 'month').format();
                    break;
                case 'พฤษภาคม':
                    mNow = m.add(4, 'month').format(),
                    mBack = m.add(5, 'month').format();
                    break;
                case 'มิถุนายน':
                    mNow = m.add(5, 'month').format(),
                    mBack = m.add(6, 'month').format();
                    break;
                case 'กรกฎาคม':
                    mNow = m.add(6, 'month').format(),
                    mBack = m.add(7, 'month').format();
                    break;
                case 'สิงหาคม':
                    mNow = m.add(7, 'month').format(),
                    mBack = m.add(8, 'month').format();
                    break;
                case 'กันยายน':
                    mNow = m.add(8, 'month').format(),
                    mBack = m.add(9, 'month').format();
                    break;
                case 'ตุลาคม':
                    mNow = m.add(9, 'month').format(),
                    mBack = m.add(10, 'month').format();
                    break;
                case 'พฤศจิกายน':
                    mNow = m.add(10, 'month').format(),
                    mBack = m.add(11, 'month').format();
                    break;   
                case 'ธันวาคม':
                    mNow = m.add(11, 'month').format(),
                    mBack = m.add(12, 'month').format();
                    break; 
                case 'ทั้งหมด':
                    mNow = m.format(),
                    mBack = m.add(12, 'month').format();
                    break;  
              }
            }).then(function () {
            db.where("dateShow",">=",mNow).where("dateShow","<",mBack)
            .orderBy("dateShow").orderBy("userId")
            .get().then(async function (snapshot) {
                snapshot.forEach(function (docs) {
                    items.push(docs.data())
                })
        
                await Promise.all(items.map(async item =>{
                    await firestore.collection("user").where("userId","==",item.userId).get().then(function (snapshot) {
                        snapshot.forEach(function (a) {
                            item["name"] = a.data().name
                            item["position"] = a.data().position
                            return item
                        })
                    })
                return item
                }))
            res.json(items);  
            })
        })
})
///////////get
app.get('/user/check', (req,res) => {
    let items = []
    let m = moment("20210101")
    let mNow = ""
    let mBack = ""
    const monthReq = {
        mm:req.body.mm
    }
    const db = firestore.collection("user")
    const dbChack = firestore.collection("checkinout")
    db.get().then(async function (snapshot) {
        snapshot.forEach(function (docs) {
            items.push(docs.data())
        })
        await Promise.all(items.map(async item =>{
            await dbChack.get().then(function () {
                switch (monthReq.mm) {
                    case 'มกราคม':
                        mNow = m.format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'กุมภาพันธ์':
                        mNow = m.add(1, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'มีนาคม':
                        mNow = m.add(2, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'เมษายน':
                        mNow = m.add(3, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'พฤษภาคม':
                        mNow = m.add(4, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'มิถุนายน':
                        mNow = m.add(5, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'กรกฎาคม':
                        mNow = m.add(6, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'สิงหาคม':
                        mNow = m.add(7, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'กันยายน':
                        mNow = m.add(8, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'ตุลาคม':
                        mNow = m.add(9, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;
                    case 'พฤศจิกายน':
                        mNow = m.add(10, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break;   
                    case 'ธันวาคม':
                        mNow = m.add(11, 'month').format(),
                        mBack = m.add(1, 'month').format();
                        break; 
                    case 'ทั้งหมด':
                        mNow = m.format(),
                        mBack = m.add(12, 'month').format();
                        break;  
                  }
            }).then(async function () {
                await dbChack.where("userId","==",item.userId).where("dateShow",">=",mNow).where("dateShow","<",mBack)
                .get().then(async function (snap) {
                    await snap.forEach(function (u) {
                        item["inout"].push(u.data())
                        console.log(item);
                        return item
                    });
                })
            });
        }))
        res.json(items);
    });
});
////////////
app.get('/get/user',async (req,res) => {
    const dbuser = await firestore.collection("user")
    const dbinout =await  firestore.collection("checkinout")

    const queryDBUserSnapshot = await dbuser.get()
    const dbUserDocs = queryDBUserSnapshot.docs.map(doc => doc.data());
    const last = await Promise.all(dbUserDocs.map(async (data) => {
            let temp ={ info: data }
            const result = await dbinout.where('userId','==', data.userId).orderBy('dateShow').get()
            const inout = result.docs.map(doc => doc.data());
            temp = {...temp, inout }

            return temp
    }));
    res.json(last)
})
///////////////////////report เข้าออก ที่ใช้ !!!!!!!!
app.get('/get/user1/:doc',async (req,res) => {
    let m = moment("20210101") // 2021-01-01T00:00:00+07:00 yyyy-mm-dd
    let mNow = ""
    let mBack = ""
    let mmyy = req.params.doc.split("S")
    console.log(mmyy[1].toString());
    switch (mmyy[1].toString()) {
        case '2021':
            m = m.add(0,'year')
            break;
        case '2022':
            m = m.add(1,'year')
            break;
        case '2023':
            m = m.add(2,'year')
            break;
        case '2024':
            m = m.add(3,'year')
            break;
        case '2025':
            m = m.add(4,'year')
            break;
    }
    switch (mmyy[0].toString()) {
        case 'January':
            mNow = m.format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'February':
            mNow = m.add(1, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'March':
            mNow = m.add(2, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'April':
            mNow = m.add(3, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'May':
            mNow = m.add(4, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'June':
            mNow = m.add(5, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'July':
            mNow = m.add(6, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'August':
            mNow = m.add(7, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'September':
            mNow = m.add(8, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'October':
            mNow = m.add(9, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;
        case 'November':
            mNow = m.add(10, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;   
        case 'December':
            mNow = m.add(11, 'month').format(),
            mBack = m.add(1, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break; 
        case 'All':
            mNow = m.format(),
            mBack = m.add(12, 'month').format();
            console.log(mNow);
            console.log(mBack);
            break;  
      }
    const dbuser = await firestore.collection("user")
    const dbinout =await  firestore.collection("checkinout")

    const queryDBUserSnapshot = await dbuser.get()
    const dbUserDocs = queryDBUserSnapshot.docs.map(doc => doc.data());
    const last = await Promise.all(dbUserDocs.map(async (data) => {
            let temp ={ info: data }
            const result = await dbinout.where('userId','==', data.userId)
            .where("dateShow",">=",mNow).where("dateShow","<",mBack).orderBy('dateShow').get()
            const inout = result.docs.map(doc => doc.data());

            data['inout'] = inout

            return temp
    }));
    res.json(last)
})
//////
app.get('/report/leave/:doc',async (req,res) =>{
    let y = moment("20210101") // 2021-01-01T00:00:00+07:00 yyyy-mm-dd
    let yNow = ""
    let yBack = ""
    // let itema = []
    // let itemb = []
    // let a = 0
    // let b = 0

    switch (req.params.doc) {
        case '2021':
            yNow = y.add(0,'year').format(),
            yBack = y.add(1,'year').format();
            break;
        case '2022':
            yNow = y.add(1,'year').format(),
            yBack = y.add(1,'year').format();
            break;
        case '2023':
            yNow = y.add(2,'year').format(),
            yBack = y.add(1,'year').format();
            break;
        case '2024':
            yNow = y.add(3,'year').format(),
            yBack = y.add(1,'year').format();
            break;
        case '2025':
            yNow = y.add(4,'year').format(),
            yBack = y.add(1,'year').format();
            break;
    }

    const dbUser = await firestore.collection('user')
    // const dbleavYear = await firestore.collection('leave').where("startValue",">=",yNow).where("startValue","<",yBack)
    const dbLeave = await firestore.collection('leave').where("startValue",">=",yNow).where("startValue","<",yBack)
    // const dbLeave = await await firestore.collection('leave').where('status','>','รออนุมัติ')
    const queryDBUserSnapshot = await dbUser.get()
    const dbUserDocs = queryDBUserSnapshot.docs.map(doc => doc.data());

    const report = await Promise.all(dbUserDocs.map(async (data)=>{
        let temp = {info: data };

        const result1 = await dbLeave.where('userId',"==",data.userId).where('status','==','อนุมัติ').get();
        const result2 = result1.docs.map(doc=> doc.data());
        const result3 = await dbLeave.where('userId',"==",data.userId).where('status','==','ไม่อนุมัติ').get()
        const result4 = result3.docs.map(doc=> doc.data());

        data['numApprove'] = result2.length
        data['numDisapproval'] = result4.length
        const result = await dbLeave.where('userId',"==",data.userId).orderBy('startValue').orderBy('status').get()
        const leave = result.docs.map(doc=> doc.data());

        data['leave'] = leave
        console.log(leave);
        return temp
    }));
    res.json(report)
})
///////////////////line
// const functions = require("firebase-functions");
// const request = require("request-promise");
  app.post('/api/test', (req, res) => {
    const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/push';
    const LINE_HEADER = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer {l/MKxHe5xVT1oqZd2/1Bnr7bcR3HTtEXvwlrcfasdzU+I0xfAkb6zpFd8TYuurWXx7/CYuU6fAkMshGXKzgDNvYiHFQPXm+PX6GyTBVqc4SEpMBfiP3i7XRXIYY41qGZTyE6JC+7rP36BijepfhP6AdB04t89/1O/w1cDnyilFU=}`
    };
    request({
      method: `POST`,
      uri: `${LINE_MESSAGING_API}`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        to: "Ud7876758fece09a64eee8d3b1030fe76",
        messages: [{
            type: "text",
            text: "LINE \uDBC0\uDC84 x \uDBC0\uDCA4 Firebase"
        }]
        })
    });
  res.json("OK")
});

//////////////
const request = require('request')