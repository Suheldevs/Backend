const mongoose = require('mongoose');
const express = require('express');
const bodyParse = require('body-parser');
const app = express();

app.use(bodyParse.json());


const MongodbURL ='mongodb://localhost:27017/backend'
mongoose.connect(MongodbURL)
.then(()=>console.log('Connection successfull'))
.catch((err)=>console.log('not! Connected'));



//creating schema

const signupSchema =new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const signup = mongoose.model('signupData',signupSchema);

//post handling

app.post('/backend/signupData',async(req,res)=>{
    try{
        const {userName,email,password}=req.body;
        const newSingup = new signup({userName,email,password});
        await newSingup.save();
        res.status(201).json({message:'sing up successfull',signup:newSingup})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Error in signup'})
    }
})

//Login api

app.post('/backend/loginData', async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:'Email and password is required'})
        }
        // Find the signup email
        const exitinguser = await signup.findOne({email});
        if(!exitinguser){
            return res.status(400).json({message:'Invalid email or password'});
        }
        //data match
        if(exitinguser.password != password){
            return res.status(400).json({message:'Invalid password'});
        }
        res.status(200).json({message:'Login successfull',user:exitinguser});
    }
    catch(err){
        console.error('Eroor during LognIn', err);;
        res.status(500).json({message:'Error during login'})
    }
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000 ")
})