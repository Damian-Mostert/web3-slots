import { AuthOptions, getServerSession } from "next-auth"

import providers from "./providers";

const authOptions: AuthOptions = {

    providers,
    pages:{
      signIn:"/sign-in",
    },
    secret:process.env.AUTH_SECRET,
    callbacks: {
      async session({ session, token }:any) {
        session.user.id = token.sub;
        return session;
      }
    },
  }

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }

