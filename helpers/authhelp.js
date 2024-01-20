import bcrypt from 'bcrypt';

export const hashpassword=async(password)=>{
    try{
        const saltrounds=10;
        const hashedpassword=await bcrypt.hash(password,saltrounds);
        return hashedpassword;
    }catch(error){
        console.log(error);
    }
}
export const comparepassword=async (password,hashedpassword)=>{
    try{
      return await bcrypt.compare(password,hashedpassword);
    }catch(error){
        console.log(error);
    }
}

  
  