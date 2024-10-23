const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongodbURI = 'mongodb://localhost:27017/digicoder';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const app = express();

app.use(bodyParser.json())
mongoose.connect(mongodbURI)
.then(()=>console.log('Mongodb is connected'))
.catch((err)=>console.log(err))

//create schema

const registerSchema = new mongoose.Schema({
    mobileNo:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    traningType:{
        type:String,
        required:true,
    },
    technology:{
        type:String,
        required:true,
    },
    education:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },
    fatherName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    altNo:{
        type:String,
    },
    college:{
        type:String,
        required:true,
    },
    paymentType:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
})

registerSchema.plugin(AutoIncrement, { inc_field: 'id' });
const registation = mongoose.model('registation',registerSchema);

app.post('/digicoder/registaion', async(req,res)=>{
    const {id,mobileNo,name,traningType,technology,education,year,fatherName,email,altNo,college,paymentType,amount} = req.body;
    const newregistation = new registation({id,mobileNo,name,traningType,technology,education,year,fatherName,email,altNo,college,paymentType,amount});
   if(!newregistation){
    return  res.status(400).json({message:'Please fill required details'});
   }
    await newregistation.save();
    res.status(200).json({message:'Registation successfull',registation:newregistation});
})

//get data 
app.get('/digicoder/get', async(req,res)=>{
    const registationData = await registation.find()
    if(!registationData){
        return res.status(400).json({message:'Data not Found in db'});
    } 
    res.status(200).json({message:'Data found',RegistationData:registationData});
})

//get data by condition 
app.post('/digicoder/getbycondition',async(req,res)=>{
    const {year} = req.body;

    const registationData = await registation.find({year})
    if(!registationData){
        return res.status(400).json({message:'Data not Found in db'});
    } 
    res.status(200).json({message:'Found data successfully!',Data:registationData});
})


//get data by condition && one data
app.post('/digicoder/getbyconditionOne',async(req,res)=>{
    const {id} = req.body;

    const registationData = await registation.findOne({id})
    if(!registationData){
        return res.status(400).json({message:'Data not Found in db'});
    } 
    res.status(200).json({message:'Found data successfully!',Data:registationData});
})


//delete by object _id
app.delete('/digicoder/delete/:id',async(req,res)=>{
    const {id}=req.params;
    const deleteData = await registation.findByIdAndDelete(id);
    if(!deleteData){
        return res.status(400).json({message:'Data not Found in db'});
    }
    res.status(200).json({message:'Data deleted successfully!',DeletedData:deleteData});
})

//delete by any field
app.post('/digicoder/delete',async(req,res)=>{
    const {id} = req.body;
    if(!id){
        return res.status(400).json({message:'Please enter a id'});   
    }
    const my_id = await registation.findOne({id});
    if(my_id.id == id){
        const deleteDatabyMy_id = await registation.deleteOne({id:`${id}`});
        res.status(200).json({message:'Data deleted successfully!',DeletedData:my_id});
    }

 })


app.listen(3000,()=>{
    console.log('Port open successfull');
})