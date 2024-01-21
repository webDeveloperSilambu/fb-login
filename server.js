const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const url = "mongodb+srv://SilambarasanDev:webdevSilambu07@cluster0.vy8omlc.mongodb.net/fbdatabase?retryWrites=true&w=majority"

let client = new MongoClient(url);

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));
app.set("view engine" , 'ejs');

app.get('/',(req,res)=>{
     client.connect();
     res.render('index.ejs');
});

app.post('/home',(req,res)=>{
     async function run(){
          try{
               await client.connect();
               var db = client.db("fbdatabase");
               var collection = db.collection("usersdb");
               var data = await collection.findOne({name : req.body.username});
               if(data){
                    if(await collection.findOne({password : req.body.password})){
                         res.render("home.ejs");
                    }
                    else{
                         res.send(`<h1>USERNAME OR PASSWORD WRONG</h1><a href="/">Login page</a>`);
                    }
               }
               else{
                    await collection.insertOne({name : req.body.username, password : req.body.password})
                    res.send("Document is Created");
               }

          }
          catch(error){
               res.send(error);
          }
     }
     run();
})


app.listen(process.env.PORT || 3000,(req,res)=>{
     console.log("Server is running on Port 3000");
});