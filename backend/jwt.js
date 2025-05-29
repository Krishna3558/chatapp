const jwt = require('jsonwebtoken');

const jwtAuth = async(req , res , next) => {
    try{
        const authenticate = req.headers.authorization;
        if(!authenticate) return res.status(400).json({message: "User not authorized"});

        const token = req.headers.authorization.split(' ')[1];
        if(!token) return res.status(400).json({message: "Token not found"});

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const genToken = (userId) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET);
    return token;
}

module.exports = {genToken , jwtAuth}