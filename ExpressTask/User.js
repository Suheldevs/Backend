const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const mongodbUrl = 'mongodb://localhost:27017/Tasks';
app.use(bodyParser.json());

mongoose.connect(mongodbUrl)
    .then(() => console.log('database connected'))
    .catch((error) => console.log(error));

//schema creation
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
})

const user = mongoose.model('User', userSchema);

//data post

app.post('/user/signup', async (req, res) => {
    try {
        const { name, email, password, status } = req.body;
        if (!name || !email || !password || !status) {
            return res.status(400).json({ message: 'all feilds are required' });
        };
        console.log(name);
        const newUser = new user({
            name,
            email,
            password,
            status
        });
        await newUser.save();
        res.status(200).json({ message: 'singUp successfully', User: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Error' });
    }
})

//get data from database using get
app.get('/user/get/:id', async (req, res) => {
    const { id } = req.params;
    const singUpData = await user.findById(id)
    singUpData ? res.status(200).json({ message: 'data Find sucessfully', User: singUpData }) : res.status(400).json({ message: 'user not found' });
})

// get data from email

app.post('/user/signup/you', async (req, res) => {
    const { email } = req.body;
    const matchData = await user.findOne({ email });
    matchData ? res.status(200).json({ message: 'data Find sucessfully', User: matchData }) : res.status(400).json({ message: 'user not found' });
})
// get data from status

app.post('/user/signup/status', async (req, res) => {
    const { status } = req.body;
    const matchData = await user.find({ status: { $regex: new RegExp(status, 'i') } });
    matchData ? res.status(200).json({ message: 'data Find sucessfully', User: matchData }) : res.status(400).json({ message: 'user not found' });
})
app.post('/user/signup/lognin', async (req, res) => {
    const { email, password } = req.body;
    const matchData = await user.findOne({ email });
    (matchData.password == password) && (matchData.status == "active") ? res.status(200).json({ message: 'data Find sucessfully', User: matchData }) : res.status(400).json({ message: 'password is incorrect' });

})

//port
app.listen(3000, () => {
    console.log("server is running on port:3000");
})