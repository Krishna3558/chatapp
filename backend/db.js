const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDb connected: ${connect.connection.host}`);
    }
    catch(err){
        console.error(err);
    }
}

connectDB();