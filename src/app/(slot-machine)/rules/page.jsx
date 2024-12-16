"use server";

import ruleService from "@/api/services/ruleService";

export default async function Home() {
  const response = await ruleService.getRules();
  return (
    <>
      {Boolean(response.data.prizes) ? Object.keys(response.data.prizes).map(key=>(<div className="flex w-full h-max" key={key}>
          <div className="w-full uppercase h-full items-center flex text-2xl">
            {key}
          </div>
          <div className="w-full flex flex-col justify-end">
            <div>
              2 in a row: {response.data.prizes[key][0]} ETH
            </div>
            <div>
              3 in a row: {response.data.prizes[key][1]} ETH
            </div>
          </div>
      </div>)):<></>}
    </>
  );
}





