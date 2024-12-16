"use client";

import "@/styles/globals.css";
import Wagmi from "@/contexts/wagmi";
import { SessionProvider } from "next-auth/react";
import Box from "@/components/box";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}) {
  const pathname = usePathname();
  return (
          <html>
            <body>
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
