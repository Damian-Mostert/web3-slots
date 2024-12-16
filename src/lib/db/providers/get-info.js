import { getServerSession } from "next-auth"
import address from "../models/address";

export default async function getSpins(){
    const session = await getServerSession();
    if(!session?.user?.email){
        return {
            success:true,
            data:{spins:undefined}  
        }
    
    }
    const record = await address.findOne({value:session?.user?.email})
    if(record){
        console.log(record)
        if(!record?.spins)record.spins = 0;
        return {
            data:record,
            success:true
        }
    }
    return {
        success:false,
        message:"Unauthenticated."   
    }
}