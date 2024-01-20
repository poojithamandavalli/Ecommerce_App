import express  from "express";
import { isAdmin, requireSignin } from "../middlewares/authmiddleware.js";
import { categorycontroller, createcategorycontroller, deletecategorycontroller, singlecategorycontroller, updatecategorycontroller } from "../controllers/categorycontroller.js";

const router=express.Router();
//routes
//create category
router.post('/create-category',requireSignin,isAdmin,createcategorycontroller);
//update category
router.put('/update-category/:id',requireSignin,isAdmin,updatecategorycontroller);
//get all categories
router.get('/get-category',categorycontroller);
//get single category
router.get('/single-category/:slug',singlecategorycontroller);
//delete category
router.delete('/delete-category/:id',requireSignin,isAdmin,deletecategorycontroller);
export default router;