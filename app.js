//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/secretDB',{ useUnifiedTopology: true,useNewUrlParser: true }).then(() => console.log("Connected"));

const userSchema =new mongoose.Schema({
  username: String,
  password: String
});

console.log(process.env.KEY);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});


const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    username: username,
    password: password
  });
  newUser.save(function(err){
      if(!err){
        res.render('secrets');
      }else{
        console.log(err);
      }
  });
});

app.post('/login', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username},function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render('secrets');
        }else{
          console.log('Failed');
        }
      }
    }
  });
});


app.listen(3000, function(){
    console.log("Server is runnnig on por 3000");
});
