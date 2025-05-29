const express = require('express');
const { jwtAuth } = require('../jwt');
const User = require('../model/User');
const Message = require('../model/Message');
const router = express.Router();
const cloudinary = require('../cloudinary');

router.get('/userData' , jwtAuth , async(req , res) => {
    try{
        const id = req.user.userId;
        const filteredUser = await User.find({_id: { $ne: id }}).select("-password");
        res.status(200).json(filteredUser);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/:id' , jwtAuth , async(req , res) => {
    try{
        const userToChatId = req.params.id;
        const userId = req.user.userId;

        const message = await Message.find({
            $or: [
                {senderId: userId , receiverId: userToChatId},
                {senderId: userToChatId , receiverId: userId}
            ]
        });

        res.status(200).json(message);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/send/:id' , jwtAuth , async(req , res) => {
    try{
        const {text , img} = req.body;
        const userId = req.user.userId;
        const recId = req.params.id;

        let imageUrl;
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: userId,
            receiverId: recId,
            text,
            img: imageUrl
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;