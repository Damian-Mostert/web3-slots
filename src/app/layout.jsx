"use client";

import "@/styles/globals.css";
import Wagmi from "@/contexts/wagmi";
import { SessionProvider } from "next-auth/react";
import Box from "@/components/box";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function RootLayout({
  children,
}) {
  const pathname = usePathname();
  var themes = [
    undefined,
    "baby-blue",
    "rock-and-roll",
    "king"
  ]
  const [theme, setTheme] = useState(Math.floor(Math.random() * themes.length));
  
  useEffect(()=>{
    console.info("theme",themes[theme]);
  },[theme])

  return (
          <html>
            <body className={themes[theme]}>
              <div className="absolute z-50 m-4" onClick={()=>setTheme(theme=>theme==themes.length-1?  0:theme+1)}>
                <div className="rounded-full bg-yellow-300 w-11 h-11 flex flex-wrap overflow-hidden cursor-pointer">
                    <div className="w-1/2 h-1/2 bg-black"/>
                    <div className="w-1/2 h-1/2"/>
                    <div className="w-1/2 h-1/2"/>
                    <div className="w-1/2 h-1/2 bg-black"/>
                </div>
              </div>
            <SessionProvider>
            <Wagmi>
              <Box {...((()=>{
                  switch(pathname){
                    case "/policy":case "/rules": case "/terms":
                      return {
                        title:pathname.replace("/","").toUpperCase(),
                      }
                    case "/sign-in":
                      return {
                        title:"Sign in",
                        hideButton:true 
                      }
                    case "/buy-spins":
                      return {
                        title:"Buy spins",
                      }
                    default:
                      return {
                        hideButton:true
                    }
                  }
              })())}>
                {(()=>{
                  switch(pathname){
                    case "/":
                      return null
                    default:
                      return children
                  }
                })()}
              </Box>
            </Wagmi>
            </SessionProvider>
            </body>
          </html>
  );
}
