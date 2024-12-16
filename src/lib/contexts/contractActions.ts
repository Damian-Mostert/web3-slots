import { parseEther } from "viem";

export interface ActionsInterface {
    reset:()=>void,
    redeem:()=>void,
    purchase:(amount:number)=>void,
    updatePrice:(value:string)=>void,
    updatePayout:(value:string)=>void,
    withdrawBalance:(amount:string)=>void,
    abi?:any,
    address?:any
}

const actions = (read: any, write: any, transact:any,reset:()=>void): ActionsInterface => {
    return {
        reset,
        redeem(){
            return write({
                functionName:"redeem",
                arguments:[]
            });
        },
        purchase(amount){
            var value =(parseEther(String(amount * Number(process.env.NEXT_PUBLIC_ETHER_PRICE))));
            return write({
                functionName:"purchase",
                value
            });
        },
        withdrawBalance(amount){
            return write({
                functionName:"withdrawBalance",
                arguments:[parseEther(amount)]
            });
        },
        updatePrice(new_price){
            return write({
                functionName:"updatePrice",
                arguments:[parseEther(new_price)]
            });
        },
        updatePayout(new_price){
            return write({
                functionName:"updatePayout",
                arguments:[parseEther(new_price)]
            });
        },
    };
};

export default actions;
