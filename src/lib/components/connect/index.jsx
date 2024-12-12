import { useConnect } from "wagmi";
import Image from "next/image";
import styles from "./styles.module.scss";

const icons = {
    MetaMask:"/logos/metamask.svg",
    Coinbase:"/logos/coinbase.png"
}

export default function Connect({}){
    const { connectors, connect } = useConnect();
    return <div className="w-full flex -mt-12">
        <div className={`p-4 rounded-2xl w-full ${styles.box}`} >
        <div className={`${styles.window} !text-[1rem] flex justify-center my-4`}>
            {[0,1,2,3,4,5,6,7,8,9,10].map((_,index)=>(<div key={`${index}`} className={`${styles.textAnimate} w-full flex justify-center`}  style={{animationDelay:`${100/((index+1) * 10)}s`}}>
                Please connect your wallet
            </div>))}
            <div className="cursor-pointer">Please connect your wallet</div>
        </div>
        <div className="flex gap-4 w-full justify-center">
            {connectors.filter(c=>(c.name == "Coinbase Wallet" || c.name == "MetaMask")).map((connector,key) => {
                return<div key={key} className={`${styles.window} !p-0 flex justify-center items-center cursor-pointer`} style={{transition:"all 1s"}} onClick={() => connect({ connector })} ><div className="p-2 w-max flex flex-col justify-center" key={connector.uid}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map((_,index)=>(<div key={`${index}`} className={`${styles.textAnimate} flex flex-col justify-center`}  style={{animationDelay:`${100/((index+1) * 10)}s`}}>
                        <Image width={200} height={100} className="h-20 w-20 object-contain m-auto" alt={"Wallet "+connector.name} src={icons[connector.name.split(" ")[0]]}/>
                        <span className="pt-4">{connector.name.split(" ")[0]}</span>
                    </div>))}
                    <Image width={200} height={100} className="h-20 w-20 object-contain m-auto" alt={"Wallet "+connector.name} src={icons[connector.name.split(" ")[0]]}/>
                    <span className="pt-4">{connector.name.split(" ")[0]}</span>
                </div></div>
            })}
        </div>

    </div>
    </div>
}