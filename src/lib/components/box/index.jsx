import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useAccount, useDisconnect, useWatchContractEvent } from "wagmi";
import Image from "next/image";
import Connect from "../connect";
import Confetti from "react-confetti";
import Link from "next/link";
import useContractActions from "@/hooks/useContractActions";
import botService from "@/api/services/botService";

export default function Box({children,title,hideButton}) {
  const { disconnect ,isSuccess:disconnectSuccess } = useDisconnect();

  useEffect(()=>{
    botService.runBot()
  },[])


  const { address } = useAccount();
  
  const [balance,setBalance] = useState(0);
  const [gettingBalance,setGettingBalance] = useState(false);
  const [spinData,setSpinData] = useState(0);
  const [gettingSpinData,setGettingSpinData] = useState(false);
  const [spins,setSpins] = useState(10);
  const [ether,setEther] = useState(0);
  const [{ width, height },setWindowDimensions] = useState({width:0,height:0});
  const [intervalId, setIntervalId] = useState(null);

  const handleMouseDown = (modifier) => {
    // Start modifying ether continuously
    const id = setInterval(() => {
      setEther((e) => parseFloat((e + modifier).toFixed(2)));
    }, 100); // Adjust interval time (100ms in this case)
    setIntervalId(id);
  };

  const handleMouseUp = () => {
    // Stop modifying ether
    clearInterval(intervalId);
    setIntervalId(null);
  };

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
  
    updateDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateDimensions);
  
    return () => {
      window.removeEventListener("resize", updateDimensions); // Cleanup on unmount
    };
  }, []);

  const [isSpinning, setIsSpinning] = useState(false);
  const [debugText, setDebugText] = useState("LETS GO!!!");
  const [showConfetti, setShowConfetti] = useState(Boolean(children)); // New state for confetti

  useEffect(()=>{
    if(Boolean(children)){
      setShowConfetti(true)
    }else{
      setShowConfetti(false)
    }
  },[children])

  const indexes = useRef([0, 0, 0]);

  const reelsRef = useRef([]);
  const slotsRef = useRef(null);
  const timeoutsRef = useRef([]);

  const [busyWithWithdraw,setBusyWithWithdraw] = useState(false);
  
  const handleWithdraw = () =>{
    setBusyWithWithdraw(true);
    actions.cashOut();
  }

  const {
    actions,
    response,
    abi,
    address:contractAddress
  } = useContractActions();


  const getBalance = () =>{
    setGettingBalance(true);
    actions.userBalance();
  }
  useEffect(getBalance,[]);

  useEffect(()=>{
    if(gettingBalance){
      if(response.readError){
        setGettingBalance(false);
        actions.reset();
      }else if(response.readData){
        setBalance(Number(response.readData));
        setGettingBalance(false);
        actions.reset();
      }
    }
  },[gettingBalance,response.readData])

  

  const realSpin= ()=>{
    setGettingSpinData(true);
    setDebugText("Please wait...")
    actions.spin();
  }

  useEffect(()=>{
    if(gettingSpinData){
      if(response.writeError){
        setGettingSpinData(false);
        actions.reset(); 
      }else if(response.writeData){
        setSpinData(response.writeData);
        setGettingSpinData(false);
        actions.reset();
      }
    }
  },[gettingSpinData,response.writeData,response.writeError])

  const [gettingSpinResult,setGettingSpinResult] = useState(false)

  useWatchContractEvent({
		abi,
		address: contractAddress,
	  eventName:"SpinResult",
		onLogs(logs){
      console.log("spin-result",logs)
      handleGamble({keys:logs[logs.length-1].args.results},logs[logs.length-1].args.prize)
      setGettingSpinResult(false);
      setShowConfetti(false);
      getBalance()
		}
	});

  useEffect(()=>{
    if(spinData){
      setSpinData(null);
      setDebugText("Please wait...");
      setGettingSpinResult(true);
    }
  },[spinData])

  useEffect(()=>{
    if(busyWithWithdraw){
      if(response.writeData && !response.writeError){
        setBusyWithWithdraw(false);
        actions.reset();
        getBalance();
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
    setDebugText("LETS GO!!!");
    setIsSpinning(false);
    setShowConfetti(false); // Reset confetti
    clearTimeouts();
    actions.reset();  
  };

  const handleGamble = (data = {
    keys : [
      "random",
      "random",
      "random",
    ],
    
  },prize) => {
    
    const {keys} = data;

    if(children)return;
    if (isSpinning) return;

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
    const numIcons = iconMap.length;
    
    const rollReel = (reel, offset, spinCount = 3) => {
      let index;
    
      // Get the current position of the reel (Y-axis position of the background)
      const currentPosition = parseFloat(getComputedStyle(reel).backgroundPositionY) || 0;
    
      // Get the current delta (number of icons the reel is currently at, based on the current position)
      const currentDelta = Math.floor(currentPosition / iconHeight) % numIcons;
    
      // If the key is "random", pick a random index from the iconMap array
      if (keys[offset] === "random") {
        index = Math.floor(Math.random() * numIcons);
      } else {
        // Otherwise, map the key to the iconMap array
        index = iconMap.indexOf(keys[offset]);
      }
    
      // Calculate the desired target delta (index you want to land on)
      const targetDelta = Math.floor(index);
    
      // Calculate the difference in delta (how many icons we need to move)
      const deltaDifference = (targetDelta - currentDelta + numIcons) % numIcons;
    
      console.log("Current Delta:", currentDelta, "Target Delta:", targetDelta, "Delta Difference:", deltaDifference);
    
      return new Promise((resolve) => {
        // Total number of positions to move (full spins + target delta)
        const totalDelta = spinCount * numIcons + deltaDifference;
    
        // Calculate the target Y position based on the total number of steps to move
        const targetY = currentPosition + totalDelta * iconHeight;
    
        // Normalize the targetY to ensure it wraps correctly within the range
        const normalizedY = targetY % (numIcons * iconHeight); // Keeps the position within the bounds of the reel's height
    
        // Apply the transition to animate the reel's movement
        timeoutsRef.current.push(
          setTimeout(() => {
            reel.style.transition = `background-position-y ${(16 + totalDelta) * 50}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `${targetY}px`; // Move to the new target position
          }, offset * 150)
        );
    
        // After the transition ends, reset the position and remove the transition
        timeoutsRef.current.push(
          setTimeout(() => {
            reel.style.transition = "none"; // Remove the transition
            reel.style.backgroundPositionY = `${normalizedY}px`; // Ensure the position is wrapped and normalized
            resolve(deltaDifference); // Return the final position (normalized)
          }, (16 + totalDelta) * 50 + offset * 150)
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
      
      setDebugText(keys.filter(i=>i=="random").length == 3 ? indexes.current.map((i) => iconMap[i]).join(" | ") : String(Number(Number(prize) / 10 ** 18).toFixed(8)));

      const [first, second, third] = indexes.current;
      
      if ((!address && (first === second || second === third )) || prize) {        
        setShowConfetti(true);

      }
    
      setIsSpinning(false);
      
      if (!address) {
        timeoutsRef.current.push(
          setTimeout(() => {
            handleGamble();
          }, 4000)
        );
      }else{
        timeoutsRef.current.push(
          setTimeout(() => {
            getBalance();
            setShowConfetti(false);
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



  const bal =<div className="flex w-full justify-center">
    {Number(Number(balance) / 10 ** 18).toFixed(14)} {balance?.symbol}
    <Image alt={"ETH"} width={60} height={60} className="w-8 h-8 pl-4" src={"/logos/ethereum.svg"} />
  </div>

  const disabled = gettingSpinData||isSpinning||busyWithWithdraw||gettingSpinResult

  

  return (
    <>
    <div className={styles.container}>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden">
        <Confetti style={{opacity:showConfetti ? "1" : "0",transition:"opacity 1s"}} width={width} height={height} />
      </div>
      <div className="relative z-10">
        <div className={`${styles.box} ${showConfetti?styles.flicker:""} relative z-[1]`}>
          {children ? <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="flex items-center w-full gap-4 text-center">
            {title ? <h2 className="text-[2rem] w-full text-center font-mono">{title}</h2>:<></>}
            {!hideButton && <Link className="ml-auto w-min" href={"/"}>BACK</Link>}
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
          <div className={`${styles["slots-buttons"]}  flex !flex-row !items-center !justify-center !-mb-8`}>
            <div className={styles.debug}>
              {String(debugText).includes("|") ? (
                <div className={`${styles.debugItem} !max-w-none flex -mt-8 gap-4 bg-black rounded-2xl`}>
                  {debugText.split("|").map((item, key) => (
                    <div className="w-full relative flex justify-center" key={key}>
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex -mt-8">
                  <div className={`${styles.debugItem} !max-w-none relative`}>
                    {debugText}                      
                  </div>
                </div>
              )}
              
            </div>
            {address && <>
              <button  style={{
              "--border": "#8B0000",
              "--background": "#FF4500",
              "--darkside": "#8B0000"  
            }} className="relative !w-min mb-6 " onClick={()=>realSpin()} disabled={disabled}>
              <span className="px-4 text-nowrap">
                SPIN ({spins})
              </span>
            </button>
            </>}
          </div>
          {address && <div className={`${styles["slots-buttons"]} -mt-4`}>
            <div className={`${styles.debugItem} !max-w-none`}>
              <div className={`w-full flex relative`}>
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
           <div className="flex gap-4">

           <button  style={{
              "--border":"#134714",
              "--background":"#2fb531",
              "--darkside":"#134714"
            }} className="relative text-nowrap" onClick={handleWithdraw} disabled={disabled}>
              Deposit ({parseFloat(ether.toFixed(2))}) ETH
            </button>
            <button  style={{
              "--border": "#8B0000", /* Dark Red */
              "--background": "#A52A2A", /* Brownish Red */
              "--darkside": "#8B0000" /* Dark Red */
            }} className="relative !w-max"             
              onMouseDown={() => handleMouseDown(-0.01)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              disabled={disabled}
            >
                <span className="px-4">-</span>
            </button>
            <button  style={{
             "--border": "#4B0082", /* Indigo */
             "--background": "#800080", /* Purple */
             "--darkside": "#4B0082" /* Indigo */
             
            }} className="relative !w-max"
               onMouseDown={() => handleMouseDown(0.01)}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
               disabled={disabled}
             >
                <span className="px-4">+</span>
            </button>
           </div>

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
