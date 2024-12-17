"use client";

import ruleService from "@/api/services/ruleService";
import { useEffect, useState } from "react";

export default function Home() {
  const [prizes,setPrizes] = useState({});
  useEffect(()=>{
    ruleService.getRules().then(response=>{
        setPrizes(response.data.prizes);
    })
  },[])
  return (
    <>
      {Object.keys(prizes).map(key=>(<div className="flex w-full h-max" key={key}>
          <div className="w-full uppercase h-full items-center flex text-2xl">
            {key}
          </div>
          <div className="w-full flex flex-col justify-end">
            <div>
              2 in a row: {prizes[key][0]} ETH
            </div>
            <div>
              3 in a row: {prizes[key][1]} ETH
            </div>
          </div>
      </div>))}
    </>
  );
}





