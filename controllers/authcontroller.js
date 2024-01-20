import usermodel from '../models/usermodel.js';
import { hashpassword } from '../helpers/authhelp.js';
import jwt from 'jsonwebtoken';
import { comparepassword } from '../helpers/authhelp.js';
import ordermodel from '../models/ordermodel.js';

export const registerController=async(req,res)=>{
    try{
  const {name,email,password,phone,address,answer}=req.body;
  if(!name){
   return res.send({message:'Name is required'});
  }
  if(!password){
    return res.send({message:'password is required'});
  }
  if(!email){
    return res.send({message:'email is required'});
  }
  if(!phone){
    return res.send({message:'phone is required'});
  }
  if(!address){
    return res.send({message:'address is required'});
  }
  if(!answer){
    return res.send({message:'answer is required'});
  }
  const exsistinguser=await usermodel.findOne({email});
  if(exsistinguser){
    return res.status(200).send({success:false,message:'user already exists,you can login '})
  }
  const hashedpassword=await hashpassword(password);
  const newuser=await new usermodel({name,email,phone,address,password:hashedpassword,answer}).save();
   return res.status(201).send({
    success:true,
    message:'registered successfully',
    newuser
  })

}catch(error){
    return res.status(500).send({
        success:false,
        message:'Error occurred',
        error
    })
}
}
export const logincontroller=async(req,res)=>{
  try{
  const {email,password}=req.body;
  if(!email||!password){
    return res.status(404).send({success:false,message:'invalid email or password'});
  }
  const user=await usermodel.findOne({email});
  
  if(!user){
    return res.status(404).send({
        success:false,
        message:'email is not registered'
    })
  }
  const old=await comparepassword(password,user.password);
  if(!old){
    return res.status(401).send({
        success:false,
        message:'Invalid password'
    })
  }
  //token
  const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
  res.status(200).send({
    success:true,
    message:"login successfully",
    user:{
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,
    },
    token,
  })

  }catch(error){
    res.status(500).send({
        success:false,
        message:'Error occurred',
        error
    })
  }
}
export const forgetpasswordcontroller=async(req,res)=>{
    try{
        const {email,answer,newpassword}=req.body;
        if(!email){
          res.status(400).send({message:'email is required'})
        }
        if(!answer){
          res.status(400).send({message:'answer is required'})
        }
        if(!newpassword){
          res.status(400).send({message:'newpassword is required'})
        }
        const user=await usermodel.findOne({email,answer});
        if(!user){
          return  res.status(404).send({
            success:false,
            message:'wrong email or answer'
           })

          }
        const hashed=await hashpassword(newpassword);
        await usermodel.findByIdAndUpdate(user._id,{
          password:hashed
        })
        res.status(200).send({
          success:true,message:'password reset successfully'
        })
    }catch(error){
      res.status(500).send({
        success:false,
        message:'something went wrong',
        error
      })
    }
}
export const testcontroller=(req,res)=>{

     res.send('protected route');
  
}
export const updateProfilecontroller=async(req,res)=>{
  try {
    const {name,email,password,phone,address}=req.body;
    const user= await usermodel.findById(req.user._id);
    if(password && password.length <6){
      return res.json({error:"Password is required and 6 character long"})
    }
    const hashedpassword=password? hashpassword(password):undefined;
    const updateduser= await usermodel.findByIdAndUpdate(req.user._id,{ //req.user._id is coming from requireSignIn middleware
      name:name || user.name,
      password: hashedpassword ||user.password,
      phone:phone ||user.phone,
      address:address || user.address,
    },{new:true})
    res.status(200).send({
      success:true,
      message:"User updated successfully",
      updateduser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error in updating Profile',
      error
    })
  }
};
//orders
export const getOrderscontroller=async(req,res)=>{
  try {
    const orders=await ordermodel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name"); //we want only name from buyers
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error while getting orders',
      error
    })
  }
};
export const getAllOrderscontroller=async(req,res)=>{
  // try {
  //   const orders=await ordermodel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt: -1 }); //we want only name from buyers
  //   res.json(orders);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send({
  //     success:false,
  //     message:'Error while getting all orders',
  //     error
  //   })
  // }
  try {
    const orders = await ordermodel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
export const orderStatuscontroller=async(req,res)=>{
  // try {
  //   const {status}=req.body;
  //   const {orderId}=req.params;
  //   const orders=await ordermodel.findByIdAndUpdate(orderId,{status},{new:true});
  //   res.json(orders);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send({
  //     success:false,
  //     message:'Error while updating status',
  //     error
  //   })
  // }
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await ordermodel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
}