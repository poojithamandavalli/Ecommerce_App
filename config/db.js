// import mongoose from 'mongoose';

// const connectdb=async ()=>{
//     const uri = process.env.MONGODB_URI;

// console.log('Connecting to MongoDB:', uri);
//  try{
//     const con =await mongoose.connect(process.env.MONGODB_URI);
//     console.log('connected to mongodb');
//  }catch(error){
//     console.log(`${error}`);
//  }
// }
// export default connectdb;
// connectdb.mjs (note the .mjs extension for ESM)

import mongoose from 'mongoose';

const connectdb = async () => {

  try {
    const con=await mongoose.connect('mongodb+srv://admin:12345678admin@poojithaapi.5wflv2i.mongodb.net/poojithaapi?retryWrites=true&w=majority').then(()=>{
        console.log('yayy connected to database');
    })
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectdb;
