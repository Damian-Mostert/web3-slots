import Init from "@/db/init"
import signInLogin from "@/db/providers/sign-in-login";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";


Init();

const providers = [
	GoogleProvider({
		clientId: process.env.GOOGLE_CLIENT_ID!,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
	}),
	CredentialsProvider({
		name: 'contract-chain-address',
		credentials: {
			address: { type:"text"},
			password: { type: "password"},
		},
		async authorize({address,password}:any) {
			const {success,message} = await signInLogin({address,password})
			console.log("message:",message)
			if (success) {
				return {
					id:address,
					email:address
				}
			}
	
			return null
		}
	}),
]
export default providers;
