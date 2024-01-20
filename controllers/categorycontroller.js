import categorymodel from "../models/categorymodel.js";
import slugify from "slugify";

export const createcategorycontroller= async(req,res)=>{
 try{
    const {name}=req.body;
    if(!name){
        return res.status(401).send({message:'name is required'});

    }
    const existingcategory=await categorymodel.findOne({name});
    if(existingcategory){
       return res.status(200).success({message:'category already exists'})
    }
    const category=await new categorymodel({name,slug:slugify(name)}).save();
    res.status(201).send({
        success:true,
        message:'new category created',
        category 
    })
 }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in Category',
        error
    })
 }
}
//update category
//{new:true}-to update category page
export const updatecategorycontroller=async(req,res)=>{
 try{
    const {name}=req.body;
    const {id}=req.params;
    const category=await categorymodel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
    res.status(200).send({
        success:true,
        message:'category updated successfully',
        category,
    });
 }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error while updating category",
        error
    })
 }
}

//get all categories
export const categorycontroller=async(req,res)=>{
    try{
        const category=await categorymodel.find({});
        res.status(200).send({
            success:true,
            message:"All categories list",
            category,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting all categories",
            error,
        })
    }
}
export const singlecategorycontroller=async(req,res)=>{
    try{
        const {slug}=req.params;
        const category=await categorymodel.findOne({slug});
        res.status(200).send({
            success:true,
            message:'Get single category successfully',
            category,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting single categorie",
            error,
        })
    }
}
//delete category
export const deletecategorycontroller=async(req,res)=>{
    try{
         const {id}=req.params;
         await categorymodel.findByIdAndDelete(id);
         res.status(200).send({
            success:true,
            message:'Category deleted successfully',
         })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while deleting category",
            error,
        })
    }
}