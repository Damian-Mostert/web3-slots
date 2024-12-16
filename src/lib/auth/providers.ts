import Init from "@/db/init"
import signInLogin from "@/db/providers/sign-in-login";
import CredentialsProvider from "next-auth/providers/credentials"

Init();

const providers = [
	CredentialsProvider({
		name: 'contract-chain-address',
		credentials: {
			"2fa-key": {type:"text"},
			address: { type:"address",label:"Address"},
			password: { type: "password",label:"Password"},
		},
		async authorize({address,password,"2fa-key":captcha_value}:any) {
			const {success,message} = await signInLogin({address,password,captcha_value})
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
