const jwt = require('jsonwebtoken')

function createToken(email,id){
    const token = jwt.sign({
            data: { 
                email: email,
                id: id
            }
        }, 
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: '5m' }  
    );

    return token
}

function verifyToken(token,callback){
    jwt.verify(token,process.env.TOKEN_SECRET_KEY,callback)
}

module.exports = {createToken,verifyToken}