
import express from 'express';
import dotenv from 'dotenv';
import authroutes from './routes/authroute.js'
import morgan from 'morgan';
import connectdb from './config/db.js';
import cors from 'cors';
import CategotyRoute from './routes/CategoryRoute.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path'

connectdb();
dotenv.config();
const app=express();
//middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use('/api/v1/auth',authroutes);

app.use('/api/v1/category',CategotyRoute);
app.use('/api/v1/product',productRoutes);

app.use("*", function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


const PORT=process.env.PORT ||8080;
app.listen(PORT,()=>{
    console.log(`Server listining to the port ${PORT}`);
})