import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
export async function middleware(req) {
  const {pathname} = new URL(req.url);
  const token = await getToken({ req, secret });

  console.log(pathname)

  if(!token)
    switch(pathname){
        case "/":
          return NextResponse.redirect(new URL("/sign-in",req.url));
        default:
          return NextResponse.next();
    }
    return NextResponse.next();
}
export const config = {
  matcher: ["/"],
};
