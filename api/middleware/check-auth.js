const  jwt = require('jsonwebtoken');

module.exports = (req, res , next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode =  jwt.verify(token,process.env.TOKEN_SECRET);
        console.log('test',decode)
        //req.userData = decode;
        next();
    } catch(error){
      return res.status(401).json({
        message : 'Auth failed.Please provide the token'
      })
    }
}