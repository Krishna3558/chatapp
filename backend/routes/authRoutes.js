const express = require('express');
const User = require('../model/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const { genToken, jwtAuth } = require('../jwt');
const cloudinary = require('../cloudinary');

router.post('/signup' , async(req , res) => {
    const {userName , password , email} = req.body;
    try{
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "This user is already exists"});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
        });
        if(newUser){
            const token = genToken(newUser._id);
            await newUser.save();
            res.status(200).json({
                userId: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                img: newUser.img,
                token: token,
                bio: newUser.bio
            });
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/login' , async(req , res) => {
    const {email , password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User with this email not exist"});

        const isMatched = await bcrypt.compare(password , user.password);

        if(!isMatched) return res.status(400).json({message: "Password is incorrect"});

        const token = genToken(user._id);
        res.status(200).json({
            userId: user._id,
            userName: user.userName,
            email: user.email,
            img: user.img,
            token: token,
            bio: user.bio
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/profile' , jwtAuth , async(req , res) => {
    try{
        const id = req.user.userId;
        const user = await User.findById(id);
        if(!user) return res.status(400).json({message: "User not found"});
        res.status(200).json(user);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.put('/updateProfile' , jwtAuth , async(req , res) => {
    try{
        const {img , userName , bio} = req.body;
        const id = req.user.userId;

        const updatedFields = {};

        if(img){
            const uploadImage = await cloudinary.uploader.upload(img);
            updatedFields.img = uploadImage.secure_url;
        }

        if(userName) updatedFields.userName = userName.trim();
        if(bio) updatedFields.bio = bio.trim();

        const updatedUser = await User.findByIdAndUpdate(id , updatedFields , {new: true});

        res.status(200).json(updatedUser);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;