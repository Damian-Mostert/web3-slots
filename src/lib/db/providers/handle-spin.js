
import getSpins from "./get-info";
import config from "../models/config";
import address from "../models/address";
import { getServerSession } from "next-auth";
import {contract} from "./bot"
import { parseEther } from "viem";

async function getSymbols(){
    var res = await config.findOne({});

    console.log(res)

    return res.prizes;
}


export default async function handleSpin(){
    const {data} = await getSpins();
    console.log(data.spins)
    if((data.spins === 0)){
        return {
            message:"no spins",
            success:false
        }
    }
    const session = await getServerSession();

    
    const symbols = await getSymbols();
    const results = generateRandomResults(Object.keys(symbols));
    const prize = generatePrize(results,symbols);
    const newBalance = (await address.findOne({ value:session.user.email})).balance+prize;
    await address.updateOne({
        value:session.user.email
    },{
        spins:data.spins-1,
        balance:newBalance
    })

    if((data.spins-1) == 0){
        await contract.setPrize(session.user.email,parseEther(String(newBalance)));
    }

    return {
        success:true,
        data:{
            results,
            prize    
        }
    }
}

const generatePrize= (results,symbols)=>{
    if(results[0] == results[1] && results[1] == results[2]){
        return symbols[results[1]][2];
    }else if((results[0] == results[1]) || results[1] == results[2]){
        return symbols[results[1]][1];
    }
    return 0
}

const generateRandomResults = (symbols) =>{
    return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
    ];
}