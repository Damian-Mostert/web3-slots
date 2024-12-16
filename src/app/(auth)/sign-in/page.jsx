"use client";

import { useAccount, useDisconnect } from "wagmi";
import styles from "@/components/box/styles.module.scss";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCsrfToken } from 'next-auth/react';
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const {address} = useAccount();
  const {disconnect} = useDisconnect();
  const router = useRouter();

  const session = useSession();

  const [token,setToken] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  useEffect(()=>{
    getCsrfToken().then(token=>{
      setToken(token)
    })
  },[]);

  useEffect(()=>{
    if(session.status == "authenticated"){
      router.push("/");
    }
  },[session.status]);

  return (
    address && session.status != "authenticated" ? <>
      <div className="w-full h-full flex items-center justify-center">
        <div className={`${styles[`slots-buttons`]} w-full h-full`}>
          <div className={styles.debug}>
            <div className={`${styles.debugItem} !max-w-none`}>
            {address?.slice(0, 5)}...{address?.slice(address?.length - 5, address?.length)}
            </div>
          </div>
          <form action="/api/auth/callback/credentials" method="POST" className="flex flex-col gap-2 text-center font-mono justify-center">
          <input type="hidden" name="csrfToken" defaultValue={token}/>
            <input name="address" type="address" hidden defaultValue={address}/>
            <label className="uppercase">Enter password:</label>
            <input name="password" className={`${styles.debugItem} !max-w-none`} type="password"/>
            <label className="text-sm m-auto text-center mb-4">If this is your first time connecting, you can just create your password</label>
            <input hidden defaultValue={captchaValue} name="2fa-key"/>
            <div className="m-auto">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
            </div>
            <button className="mt-4" type="submit">Submit</button>
          </form>
          <button className="mt-auto" onClick={()=>{
            disconnect()
            router.push("/")
          }}>Disconnect</button>
        </div>
      </div>
    </> : undefined
  );
}





