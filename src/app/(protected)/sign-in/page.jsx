"use client";

import Box from "@/components/box";
import { useAccount, useDisconnect } from "wagmi";
import styles from "@/components/box/styles.module.scss";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const {address} = useAccount();
  const [password,setPassword] = useState("");
  const {disconnect} = useDisconnect();
  const router = useRouter();

  const session = useSession();

  

  return (
    address && session.status != "authenticated" ? <Box title="Sign in" hideButton={true}>
      <div className="w-full h-full flex items-center justify-center">
        <div className={`${styles[`slots-buttons`]} w-full h-full`}>
          <div className={styles.debug}>
            <div className={`${styles.debugItem} !max-w-none`}>
            {address?.slice(0, 5)}...{address?.slice(address?.length - 5, address?.length)}
            </div>
          </div>
          <form className="flex flex-col gap-2 text-center font-mono">
            <input type="email" hidden defaultValue={address}/>
            <label className="uppercase">Enter password:</label>
            <input value={password} onChange={({target})=>{
              setPassword(target.value)
            }} className={`${styles.debugItem} !max-w-none`} type="password"/>
          </form>
            <label className="text-sm m-auto text-center">If this is your first time connecting, you can just create your password</label>
          <button className="mt-auto" onClick={async()=>{
            signIn('contract-chain-address',{
              address,
              password,
              redirect:false,
            });
          }}>Log in</button>
          <button onClick={()=>{
            disconnect()
            router.push("/")
          }}>Disconnect</button>

        </div>
      </div>
    </Box> : <Box/>
  );
}





