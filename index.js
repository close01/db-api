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

app.get('/api/get/user/:doc', (req, res) => {
    firestore.collection("user").doc(req.params.doc).get().then(function(docs){
        res.json(docs.data()); 
    });
});

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

