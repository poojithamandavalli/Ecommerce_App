import jwt from 'jsonwebtoken'
import usermodel from '../models/usermodel.js';

export const requireSignin=(req,res,next)=>{
    try{
    
    const decode=jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    
    // console.log('decoded', decode);
    req.user=decode;
    next();
    }catch(error){
        console.log(error);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
}
//ADMIN ACCESS
export const isAdmin=async (req,res,next)=>{
    try{
      const user=await usermodel.findById(req.user._id);
      
     // console.log(user);
      
      if(user.role !== 1){
        return res.status(401).send({success:false,message:'unauthorized user'})
      }
      else{
        next();
      }
    }catch(error){
      console.log(error);
      res.status(401).send({
        success:false,
        message:'error in admin middleware',
        error
      })
    }
  }