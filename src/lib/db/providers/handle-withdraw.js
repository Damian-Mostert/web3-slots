
import { getServerSession } from "next-auth";
import Spin from "../models/spin";
import getSpins from "./get-info";
import config from "../models/config"

async function getSymbols(){
    return (await config.findOne({})).prizes;
}


export default async function handleSpin(){
    const spins = await getSpins();

    if(spins == 0)
        return {
            message:"no spins",
            success:false
        }

    const symbols = await getSymbols();
    const results = generateRandomResults(Object.keys(symbols));
    const prize = generatePrize(results,symbols);

    const session = await getServerSession();

    await Spin.create({
        address:session.user.email,
        results,
        prize
    });

    return {
        success:true,
        data:{
            results,
            prize    
        }
    }
}

const generatePrize= (results,symbols)=>{
    const prize = 0;
    if(results[0] == results[1] && results[1] == results[2]){
        prize+= symbols[results[1]][2];
    }else if((results[0] == results[1]) || results[1] == results[2]){
        prize+= symbols[results[1]][1];
    }
    return prize;
}

const generateRandomResults = (symbols) =>{
    return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
    ];
}