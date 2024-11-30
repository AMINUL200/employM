import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try{
        const {token} = req.headers;

        if(!token){
            return res.status(401).json({message: "No token, authorization denied"});
        }

        const token_decode = jwt.verify(token,  process.env.JWT_SECRET_KEY);

        if(token_decode !==  process.env.ADMIN_USER_NAME + process.env.ADMIN_PASSWORD){
            return res.status(403).json({message: 'Unauthorized Admin'});
        }
        next();

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Token is not valid'});
    }
}

export default authAdmin;