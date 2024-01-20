import express from 'express';
import { testcontroller,logincontroller, registerController ,forgetpasswordcontroller, updateProfilecontroller, getOrderscontroller, getAllOrderscontroller, orderStatuscontroller} from '../controllers/authcontroller.js';
import { requireSignin } from '../middlewares/authmiddleware.js';
import { isAdmin } from '../middlewares/authmiddleware.js';

const router=express.Router();
//register
router.post('/register',registerController);
//login
router.post('/login',logincontroller);
//token
router.get('/test',requireSignin,isAdmin,testcontroller);
//protected route--user
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true});
})
//forget password
router.post('/forget-password',forgetpasswordcontroller);
//admin
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})
//update profile
router.put('/profile',requireSignin,updateProfilecontroller);
//orders
router.get('/orders',requireSignin,getOrderscontroller);
//all-orders
router.get('/all-orders',requireSignin,isAdmin,getAllOrderscontroller);
// order status update
router.put('/order-status/:orderId',requireSignin,isAdmin,orderStatuscontroller);

export default router