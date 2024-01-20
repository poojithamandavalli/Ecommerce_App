import express  from "express";
import { isAdmin, requireSignin } from "../middlewares/authmiddleware.js";
import { braintreePaymentscontroller, braintreeTokencontroller, createproductcontroller, deleteProductcontroller, getSingleproductcontroller, getproductcontroller, productCategorycontroller, productCountcontroller, productFiltercontroller, productListcontroller, productPhotocontroller, relatedProductcontroller, searchproductcontroller, updateProductcontroller } from "../controllers/productcontroller.js";
import formidable from 'express-formidable';

const router=express.Router();
//routes
router.post('/create-product',requireSignin,isAdmin,formidable(),createproductcontroller);
//get product
router.get('/get-product',getproductcontroller);
//get single-product
router.get('/get-product/:slug',getSingleproductcontroller);
//get photo
router.get('/product-photo/:pid',productPhotocontroller);
//delete route
router.delete('/delete-product/:pid',deleteProductcontroller);
//update route
router.put('/update-product/:pid',requireSignin,isAdmin,formidable(),updateProductcontroller);
//filter products
router.post('/product-filters',productFiltercontroller);
//product.count
router.get('/product-count',productCountcontroller);
//product per page
router.get('/product-list/:page',productListcontroller);
//search product 
router.get('/search/:keyword',searchproductcontroller);
//similar products
router.get('/related-product/:pid/:cid',relatedProductcontroller);
//category wise product
router.get('/product-category/:slug',productCategorycontroller);
//PAYMENTS ROUTE
router.get('/braintree/token',braintreeTokencontroller);
//payments
router.post('/braintree/payment',requireSignin,braintreePaymentscontroller);
export default router;