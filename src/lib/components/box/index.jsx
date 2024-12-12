import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import Connect from "../connect";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Link from "next/link";
import useContractActions from "@/hooks/useContractActions";

export default function Box({children,title}) {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const [balance,setBalance] = useState(0);

  const [gettingBalance,setGettingBalance] = useState(false);


  const {
    actions,
    response
  } = useContractActions();
  
  const getBalance = () =>{
    setGettingBalance(true);
    actions.userBalance();
  }

  useEffect(()=>{
    getBalance();    
  },[]);

  useEffect(()=>{
    if(gettingBalance){
      if(response.readData && !response.readError){
        setBalance(Number(response.readData));
        setGettingBalance(false);
        actions.reset();
      }else if(response.readError){
        setGettingBalance(false);  
      }
    }
  },[gettingBalance,response.readData])

  const [spinData,setSpinData] = useState(0);
  const [gettingSpinData,setGettingSpinData] = useState(false);

  const realSpin= ()=>{
    setGettingSpinData(true);
    actions.spin();
  }

  useEffect(()=>{
    if(gettingSpinData){
      if(response.writeData && !response.writeError){
        setSpinData(response.writeData);
        actions.reset();
        setGettingSpinData(false);
      }else if(response.writeError){
        setGettingSpinData(false);
        actions.reset();  
      }
    }
  },[gettingSpinData,response.writeData,response.writeError])

  useEffect(()=>{
    if(spinData){
      handleGamble({keys:spinData.results})
      setSpinData(null);
    }
  },[spinData])

  useEffect(()=>{
    console.info("response:",response)
  },[response])

  var width = 2000,height = 1000;

  const { width:w, height:h } = useWindowSize({ initialHeight: typeof window != "undefined"?window.innerHeight:height , initialWidth:typeof window != "undefined"? window.innerWidth:"height" });
  width = w;
  height = h;

  const [isSpinning, setIsSpinning] = useState(false);
  const [debugText, setDebugText] = useState("LETS GO!!!");
  const [showConfetti, setShowConfetti] = useState(false); // New state for confetti
  const indexes = useRef([0, 0, 0]);

  const reelsRef = useRef([]);
  const slotsRef = useRef(null);
  const timeoutsRef = useRef([]);

  const [busyWithWithdraw,setBusyWithWithdraw] = useState(false);
  const handleWithdraw = () =>{
    setBusyWithWithdraw(true);
    actions.cashOut();
  }
  useEffect(()=>{
    if(busyWithWithdraw){
      if(response.writeData && !response.writeError){
        actions.reset();
        setBusyWithWithdraw(false);
      }else if(response.writeError){
        setBusyWithWithdraw(false);
        actions.reset();  
      }
    }
  },[busyWithWithdraw,response.writeData,response.writeError])

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const resetMachine = () => {
    if(children)return;
    indexes.current = [0, 0, 0];
    reelsRef.current.forEach((reel) => {
      if (reel) {
        reel.style.transition = "none";
        reel.style.backgroundPositionY = "0px";
      }
    });

    slotsRef.current?.classList.remove("win1", "win2");
    setDebugText("LETS GO!!!");
    setIsSpinning(false);
    setShowConfetti(false); // Reset confetti
    clearTimeouts();
  };

  const handleGamble = (data = {
    keys : [
      "random",
      "random",
      "random",
    ]
  }) => {
    
    const {keys} = data;

    if(children)return;
    if (isSpinning) return;

    if(address){
      realSpin();
      return;
    }

    setShowConfetti(false); 
    setIsSpinning(true);
    setDebugText("spinning");

    const iconMap = [
      "banana", 
      "seven",
      "cherry",
      "plum",
      "orange",
      "bell",
      "bar",
      "lemon",
      "melon"
    ];

    const iconHeight = 79;
    const numIcons = 9;

    const rollReel = (reel, offset) => {
      const index = keys[offset] == "random" ? Math.random() : iconMap.indexOf(keys[offset]);

      const delta = (offset + 2) * numIcons + Math.floor(index * numIcons);

      return new Promise((resolve) => {
        const startY = parseFloat(getComputedStyle(reel).backgroundPositionY) || 0;
        const targetY = startY + delta * iconHeight;
        const normalizedY = targetY % (numIcons * iconHeight);
        timeoutsRef.current.push(
          setTimeout(() => {
            reel.style.transition = `background-position-y ${(16 + delta) * 50}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `${targetY}px`;
          }, offset * 150)
        );
        timeoutsRef.current.push(
          setTimeout(() => {
            reel.style.transition = "none";
            reel.style.backgroundPositionY = `${normalizedY}px`;
            resolve(delta % numIcons);
          }, (16 + delta) * 50 + offset * 150)
        );
      });
    };
    const rollAll = async () => {
      const results = await Promise.all(
        reelsRef.current.map((reel, i) => reel && rollReel(reel, i))
      );
      results.forEach((delta, i) => {
        indexes.current[i] = (indexes.current[i] + delta) % numIcons;
      });
      setDebugText(indexes.current.map((i) => iconMap[i]).join(" | "));
      const [first, second, third] = indexes.current;
      if (first === second || second === third) {
        const winClass = first === third ? "win2" : "win1";
        slotsRef.current?.classList.add(winClass);
        setShowConfetti(true); // Show confetti on win
        timeoutsRef.current.push(
          setTimeout(() => {
            slotsRef.current?.classList.remove(winClass);
          }, 8000)
        );
      }

      setIsSpinning(false);
      if (!address) {
        timeoutsRef.current.push(
          setTimeout(() => {
            handleGamble();
          }, 4000)
        );
        
      }
    };

    rollAll();
  };

  useEffect(() => {
    if (address) {
      resetMachine();
    } else {
      handleGamble();
    }
    return clearTimeouts;
  }, [address]);



  const bal =<>
    {Number(balance).toFixed(14)} {balance?.symbol}
    <Image alt={"ETH"} width={60} height={60} className="w-8 h-8 pl-4" src={"/logos/ethereum.svg"} />
  </>

  const disabled = gettingSpinData||isSpinning||busyWithWithdraw

  

  return (
    <>
    <div className={styles.container}>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden">
        <Confetti style={{opacity:showConfetti ? "1" : "0",transition:"opacity 1s"}} width={width} height={height} />
      </div>
      <div className="relative z-10">
        <div className={`${styles.box} ${showConfetti?styles.flicker:""} relative z-[1]`}>
          {children ? <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="flex items-center w-full gap-4">
            {title ? <h2 className="text-[2rem]">{title}</h2>:<></>}
            <Link className="ml-auto w-min" href={"/"}>BACK</Link>
            </div>
            <div className="w-full h-full overflow-auto flex flex-col gap-4">
            {children}
            </div>
          </div> : <>
          <div className={styles.slots} ref={(el) => (slotsRef.current = el)}>
            {[0, 1, 2].map((_, i) => (
              <div key={i} className={styles.reelContainer}>
                <div className={styles.reel} ref={(el) => (reelsRef.current[i] = el)} />
              </div>
            ))}
          </div>
          <div className={styles["slots-buttons"]}>
            <div className={styles.debug}>
              {String(debugText).includes("|") ? (
                <div className={`${styles.debugItem} !max-w-none flex -mt-8 gap-4 bg-black rounded-2xl`}>
                  {debugText.split("|").map((item, key) => (
                    <div className="w-full relative flex justify-center" key={key}>
                      {[0,1,2,3,4,5,6,7,8,9,10].map((_,index)=>(<div key={`${index}_${key}`} className={`${styles.textAnimate} gap-6`}  style={{animationDelay:`${100/((index+1) * 10)}s`}}>
                        {item}
                      </div>))}
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex -mt-8">
                  <div className={`${styles.debugItem} !max-w-none relative`}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map((_,index)=>(<div key={index} className={` ${styles.textAnimate} gap-6`}  style={{animationDelay:`${100/((index+1) * 10)}s`}}>
                      {debugText}
                    </div>))}
                    {debugText}                      
                  </div>
                </div>
              )}
            </div>
            {address && <>
              <button  style={{
                "--border":"#134714",
                "--background":"#2fb531",
                "--darkside":"#134714"
            }} className="relative -mt-4" onClick={()=>realSpin()} disabled={disabled}>
              <Image
                alt={"ETH"}
                width={60}
                height={60}
                className="absolute p-1 h-full bg-white bg-opacity-25"
                src={"/logos/ethereum.svg"}
              />
              Spin ({process.env.NEXT_PUBLIC_ETHER_PRICE} ETH)
            </button>
            </>}
          </div>
          {address && <div className={`${styles["slots-buttons"]} -mt-4`}>
            <div className={`${styles.debugItem} !max-w-none`}>
              <div className={`w-full flex relative`}>
                {[0,1,2,3,4,5,6,7,8,9,10].map((_,index)=>(<div key={index} className={`${styles.textAnimate}`}  style={{animationDelay:`${100/((index+1) * 10)}s`}}>{bal}</div>))}
                {bal}
              </div>
            </div>
            <button  style={{
                "--border":"#2c3166",
                "--background":"#5761c9",
                "--darkside":"#2c3166"
            }} className="relative" onClick={handleWithdraw} disabled={disabled}>
              <Image
                alt={"ETH"}
                width={60}
                height={60}
                className="absolute p-1 h-full bg-white bg-opacity-25"
                src={"/logos/ethereum.svg"}
                
              />
              withdraw
            </button>
             {/*@ts-ignore*/}
            <button onClick={disabled ? undefined : disconnect} disabled={disabled}>
              <span className="px-8">
                Disconnect {address.slice(0, 5)}...{address.slice(address.length - 5, address.length)}
              </span>
            </button>
          </div>}
          {!address && <Connect />}
          <div className="w-full flex gap-4 px-4 pb-4 justify-end">
          <Link href={"/rules"} className="bold mr-auto">Rules</Link>
            <Link href={"/policy"} className="bold">Privacy Policy</Link>
            <Link href={"/terms"} className="bold">Terms and conditions</Link>
          </div>
          </>}
        </div>
      </div>
    </div>
    </>
  );
}
