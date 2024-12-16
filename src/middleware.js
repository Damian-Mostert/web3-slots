import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const {pathname} = new URL(req.url);
  const token = await getToken({req});

  console.log(token,pathname);

  if(!token?.id){    
    switch(pathname){
        case "/api/spin/get-info":
        case "/api/spin/handle-spin":
        case "/api/spin/update-rules":
        case "/api/spin/withdraw":
        case "/buy-spins":
        return NextResponse.json({
            error:"Unauthenticated"
          });
        default:
          return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/","/:path"],
};
