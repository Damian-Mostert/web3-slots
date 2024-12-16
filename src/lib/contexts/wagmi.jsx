"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import React, { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useContractReads, useWriteContract, useSendTransaction } from "wagmi";
import { defineChain } from "viem";
import Currency from "@/data/config/currency.json";
import contractActions from "./contractActions";
import contractData from "./contractData";

import Bid from "@/data/artifacts/src/lib/contracts/Bid.sol/Bid.json";

import { useRouter } from "next/navigation";
const {abi} = Bid;

export const chain = defineChain({
	id: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
	name: String(process.env.NEXT_PUBLIC_NETWORK_ID),
	nativeCurrency: Currency,
	rpcUrls: {
		default: {
			http: [String(process.env.NEXT_PUBLIC_NETWORK_RPC)],
		},
	},
	blockExplorers: {
		default: {
			name: "Annum",
			url: String(process.env.NEXT_PUBLIC_NETWORK_RPC),
		},
	},
});

export const config = defaultWagmiConfig({
	chains: [chain],
	projectId: String(process.env.NEXT_PUBLIC_PROJECT_ID),
	metadata: {
		name: "Annum",
		description: "Annum 366 Tokens",
		url: String(process.env.NEXT_PUBLIC_NETWORK_RPC),
		icons: ["/img/Annum.gif"],
	},
	ssr: typeof window !== "undefined",
	storage: createStorage({
		storage: cookieStorage,
	}),
});

export const WalletContext = createContext(null);

export default function Wagmi({ children }) {
	const [queryClient] = useState(() =>
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false,
				},
			},
		})
	);



	return (
		<WagmiProvider reconnectOnMount={true} config={config}>
			<QueryClientProvider client={queryClient}>
				<Context>{children}</Context>
			</QueryClientProvider>
		</WagmiProvider>
	);
}


function Context({children}){

	const useWrite = useWriteContract();
	const useTransaction = useSendTransaction();
	const [contracts,setContracts] = useState([]);
	const useReads = useContractReads({contracts});
	const router = useRouter();

	const reset = ()=>{
		useWrite.reset();
		useTransaction.reset(),
		setContracts([])
	}

	const read = (_contracts) => {
		setContracts([{
			abi,
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
			..._contracts
		}]);
		useReads.refetch();
	};

	const write = (config) => {
		useWrite.writeContract({
			abi,
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
			...config
		})
	};

	const transact = (transactionConfig) => {
		useTransaction.sendTransaction({
			abi,
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
			...transactionConfig
		})
	};

	const value ={
		actions: contractActions(read, write, transact, reset),
		data: contractData(read),
		response: {
			readError:useReads.error,
			writeError:useWrite.error,
			transactError:useTransaction.error,
			readData:useReads.data?.[0]?.result,
			writeData:useWrite.data,
			transactData:useTransaction.data
		},
		abi,
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
	};

	return <WalletContext.Provider value={value}>
		{children}
	</WalletContext.Provider>
}