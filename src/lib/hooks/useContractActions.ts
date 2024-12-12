import {WalletContext} from "@/contexts/wagmi";
import {ActionsInterface} from "@/contexts/contractActions"
import { useContext } from "react";

export const useContractActions:()=>{response:{
    readError:any,
    writeError:any,
    transactError:any,
    readData:any,
    writeData:any,
    transactData:any
},actions:ActionsInterface} = () => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error("useWallet must be used within a WagmiProvider");
	}
	return context;
};

export default useContractActions;