import { parseEther } from "viem";

export interface ActionsInterface {
    reset:()=>void,
    spin:()=>void,
    userBalance:()=>void,
    cashOut:()=>void,
    admin:{
        deposit:(amount:number)=>void,
        updatePrice:(new_price:number)=>void,
        updatePoints:(symbol:string,twoMatchPayout:number,threeMatchPayout:number)=>void
    },
}

const actions = (read: any, write: any, transact:any,reset:()=>void): ActionsInterface => {
    return {
        reset,
        userBalance(){
            return Number(read({
                functionName:"userBalance",
                args:[]
            }));
        },
        spin(){
            return write({
                functionName:"spin",
                args:[],
                value:parseEther(process.env.NEXT_PUBLIC_ETHER_PRICE ? process.env.NEXT_PUBLIC_ETHER_PRICE:"0")
            });  
        },
        cashOut(){
            return write({
                functionName:"cashOut",
                args:[]
            });  
        },
        admin:{
            updatePrice(new_price){
                return write({
                    functionName:"updatePrice",
                    arguments:[new_price]
                });  
            },
            updatePoints(symbol,twoMatchPayout,threeMatchPayout){
                return write({
                    functionName:"updatePrice",
                    arguments:[symbol,twoMatchPayout,threeMatchPayout]
                });  
            },
            deposit(amount){
                return write({
                    functionName:"deposit",
                    value:amount,
                    args:[]
                });    
            },
        }
    };
};

export default actions;
