import { getServerSession } from "next-auth";
import {contract} from "./bot";
import config from "../models/config";

export default async function updateRules(new_rules){
    const owner = await contract.owner();
    const session = await getServerSession();
    if(session?.user?.email !== owner){
        return {
            success:false,
            message:"not the owner"
        }
    }
    await config.updateOne({},new_rules)
    return {    
        success:true,
        message:"rules updated"
    }
}