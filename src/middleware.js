import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const secret = process.env.NEXTAUTH_SECRET; 
const owner = process.env.OWNER_ADDRESS
export async function middleware(req) {
  const {pathname} = new URL(req.url);
  const token = await getToken({ req, secret });
  if(!token?.email){    
    switch(pathname){
        case "/api/spin/get-info":
        case "/api/spin/handle-spin":
        case "/api/spin/update-rules":
        case "/api/spin/withdraw":
        case "/buy-spins":
        case "/admin":
          return NextResponse.json({
            error:"Unauthenticated"
          });
        case "/":
          return NextResponse.redirect("/sign-up");
        default:
          return NextResponse.next();
    }
  }else{
    switch(pathname){
      case "/admin":
        console.log(token.email,owner)
        if(token.email !== owner){
          return NextResponse.json({
            error:"Unauthenticated"
          });
        }else{
          return NextResponse.next();
        }
      default:
        return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/","/:path"],
};
