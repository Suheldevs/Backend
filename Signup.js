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
    },
    gender:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    hobbies:{
        type:[String],
    },
    skills:{
        technical:{
            type:[String]
        },
        tools:{
            type:[String]
        }
    }
    
})

const signup = mongoose.model('signupData',signupSchema);

//post handling

app.post('/backend/signupData',async(req,res)=>{
    try{
        const {userName,email,password,gender,status,hobbies,skills}=req.body;
        const newSingup = new signup({userName,email,password,gender,status,hobbies:hobbies|| [],skills:skills || {}});
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

//delete data from data base.
app.delete('/backend/delete/:id', async(req,res)=>{
    try{
    const {id}=req.params;
    //find user by id
    const deletedUser =  await signup.findByIdAndDelete(id);
    if(!deletedUser){
        return res.status(400).json({meassage:'User Not Found'});
    }
    res.status(200).json({message:'User deleted successfully',user:deletedUser});
}
catch(err){
    res.status(500).json({message:'Error deleting user'})
}
})


//find data by any common feild 

app.get('/backend/find', async(req,res)=>{
    const findData = await signup.find({status:"Active"})
    if(!findData){
        return res.status(400).json({message:'Not font any data'})
    }
    res.status(200).json({message:'User find',user:findData})
 })


app.listen(3000,()=>{
    console.log("Server is running on port 3000 ")
})