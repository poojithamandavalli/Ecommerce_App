import slugify from "slugify";
import productmodel from "../models/productmodel.js";
import fs from 'fs';
import categorymodel from "../models/categorymodel.js";
import braintree from "braintree";
import ordermodel from "../models/ordermodel.js";
import dotenv from "dotenv";

dotenv.config();
//payment gateway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    // publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    publicKey:5g8r9wnbt8gmfjzr,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createproductcontroller = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' });
            case !photo && photo.size > 10000:
                return res.status(500).send({ error: 'photo is required and size should be less than 1mb' });
        }
        const products = new productmodel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product created Successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error,
        })
    }
}
//get products
export const getproductcontroller = async (req, res) => {
    try {
        const products = await productmodel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: 'All products',
            counttotal: products.length,
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message,
        })
    }
}
export const getSingleproductcontroller = async (req, res) => {
    try {
        const { slug } = req.params;
        const products = await productmodel.findOne({ slug }).select('-photo').populate('category');
        res.status(200).send({
            success: true,
            message: 'Single product fetched',

            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting single product",
            error: error.message,
        })
    }
}
//get product photo
export const productPhotocontroller = async (req, res) => {
    try {
        //const {id}=req.params;
        const product = await productmodel.findById(req.params.pid).select("photo");

        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting photo",
            error,
        })
    }
}
export const deleteProductcontroller = async (req, res) => {
    try {
        const products = await productmodel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'product deleted successfully',

            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error,
        })
    }
}/*
export const updateProductcontroller = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' });
            case !photo && photo.size > 10000:
                return res.status(500).send({ error: 'photo is required and size should be less than 1mb' });
        }
        //const products = await productmodel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{ new:true })
        const products = await productmodel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        console.log("hello hii:  ", products);
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product updated Successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update product",
            error,
        })
    }
}
*/
export const updateProductcontroller = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Additional logging
        // console.log("Received update request for product with ID:", req.params.pid);
        // console.log("Received fields:", req.fields);
        // console.log("Received files:", req.files);

        switch (true) {
            // ... existing switch cases ...
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' });
            case photo && photo.size > 10000:
                return res.status(500).send({ error: 'photo is required and size should be less than 1mb' });
        }

        //const products = await productmodel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{ new:true })
        const products = await productmodel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        
        // Check if products is null (no product found with the given ID)
        if (!products) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Additional logging
        //console.log("Updated product:", products);

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        // Additional logging
       // console.log("Product saved after update:", products);

        res.status(200).send({
            success: true,
            message: 'Product updated Successfully',
            products,
        });
    } catch (error) {
        console.error("Error in updateProductcontroller:", error);

        res.status(500).send({
            success: false,
            message: "Error in update product",
            error,
        });
    }
};
//filters
export const productFiltercontroller = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productmodel.find(args);
        if (products) {
            res.status(200).send({
                success: true,
                products
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while Filtering the products',
            error
        })
    }
}
//product count
export const productCountcontroller = async (req, res) => {
    try {
        const total = await productmodel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while getting products count',
            error
        })
    }
}
//product-list based on page
export const productListcontroller = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productmodel.find({})
            .select('-photo')
            .skip((page - 1) * perPage) //starts skipping from start
            .limit(perPage)
            .sort('createdAt:-1');
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error on per page control',
            error
        })
    }
}
//search product
export const searchproductcontroller = async (req, res) => {
    try {
        const {keyword}=req.params;
        const result=await productmodel.find({
            $or:[
                {name:{$regex :keyword, $options:"i"}},
                {description:{$regex :keyword, $options:"i"}}
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in search product api',
            error
        })
    }
}
//similar products
export const relatedProductcontroller=async(req,res)=>{
    try {
        const {cid,pid}=req.params;
        const products=await productmodel.find({
            category:cid,
            _id:{$ne:pid},
        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success:true,
        products
    })
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: 'Error in similar products api',
        error
    })   
    }
}

//category wise products
export const productCategorycontroller=async(req,res)=>{
    try {
        const {slug}=req.params;
        const category=await categorymodel.find({slug});
        const products= await productmodel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            category,
            products,
        })
    } catch (error) {
        console.log(error);
      res.status(400).send({
        success: false,
        message: 'Error in getting catgory wise products',
        error
      })
    }
};
//payment gateway api
export const braintreeTokencontroller=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);

            }
            else{
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
        
    }
    
};
//payments
export const braintreePaymentscontroller=async(req,res)=>{
   try {
        const  {nonce, cart }=req.body;
        let total=0;
        cart.map((i)=>{
            total+=i.price
        });
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }

        },
        function(error,result){
           
            if(result){
                const order= new ordermodel({            //creating a new order
                    products:cart,
                    payment:result,
                    buyer:req.user._id,
                    
                }).save()
                res.json({ ok:true });
            }else{
                res.status(500).send(error)
            }
        }
        );
    } catch (error) {
        console.log(error);
        
    }
             
};
