import { useConnect } from "wagmi";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const icons = {
    MetaMask:"/logos/metamask.svg",
    Coinbase:"/logos/coinbase.png"
}

export default function Connect({hide}){
    const { connectors, connect, isSuccess:isConnected } = useConnect();
    const router = useRouter();
    
    useEffect(()=>{
        if(isConnected){
            router.push("/sign-in")
        }
    },[isConnected])

    return <>{!hide?<>
        <div className="w-full flex -mt-4">
            <div className={`p-4 rounded-2xl w-full ${styles.box}`} >
                <div className={`${styles.window} !text-[1rem] flex justify-center my-4`}>
                <div className="cursor-pointer">Please connect your wallet</div>
            </div>
            <div className="flex gap-4 w-full justify-center py-2">
                {connectors.filter(c=>(c.name == "Coinbase Wallet" || c.name == "MetaMask")).map((connector,key) => {
                    return<div key={key} className={`${styles.window} !p-0 flex justify-center items-center cursor-pointer`} style={{transition:"all 1s"}} onClick={() => connect({ connector })} ><div className="p-2 w-max flex flex-col justify-center" key={connector.uid}>
                            <Image width={200} height={100} className="h-20 w-20 object-contain m-auto" alt={"Wallet "+connector.name} src={icons[connector.name.split(" ")[0]]}/>
                            <span className="pt-4">{connector.name.split(" ")[0]}</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
    </>:<></>}</>
}