"use client";
import AnimatedTitle from "./components/AnimatedTitle";
import { useState, useEffect,useRef } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import Markdown  from "react-markdown";
import { ThemeProvider } from "next-themes";


type Message = {
  role: "user" | "bot"; 
  text: string;
}

export default function Home() {
  // use states
  const [userInput, setUserInput] = useState(""); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null); 
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const [showDisplay, setShowDisplay] = useState(false);
  // const [newChat, changeNewChat] = useState(false);

  // to make the displayarea scroll down to recent most inputs and outputs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => prev === "..." ? "." : prev + "."); // if three dots go back to one if not add one more
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);


  // when "enter" is pressed on the user input area
  const keyDown = async ( e: { key: string; preventDefault: () => void; }) => {

    // enter key is pressed down
    if (e.key == "Enter") {
      // makes sure enter doesn't create a new line in the textarea
      e.preventDefault();
      // set the textArea back to an empty string
      setUserInput("");

      // enter user input into messages so that it updates and shows what you typed in the textbox
      setMessages([
        ...messages, 
        {role: "user", text: userInput}, // add user input 
      ])

      // show the displayarea
      setShowDisplay(true);
      // set loading mode on
      setLoading(true);
      setLoadingDots(".");

      const selectedMode = userInput.toLowerCase();

      let data: {reply: string};
      // call backend to get the bot's response
      if (mode === "") {
        // check if user was talking about inside or outside
        if (selectedMode === "inside") { //if user input is inside
          // get the first message 
          // works bc at this time inside_messages[] in backend is empty
          setMode("inside");
          const response = await fetch("http://localhost:8000/chat", {
            method:"POST", 
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: "inside", // hard coded just to make sure it's right
              mode: selectedMode
            })
          });
          data = await response.json();
        } else if (selectedMode === "outside") { // if user input is outside
          setMode("outside");
          // get the first ouside message, same idea as inside
          const response = await fetch("http://localhost:8000/chat", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: "outside", // hard coded just to make sure it's right
              mode: selectedMode
            })
          });
          data = await response.json(); 
        } else {
            // user typed something invalid, maybe remove their message and prompt them
            setMessages(prev => prev.slice(0, -1)); // remove the message we just added
            // or just don't add the bot reply at all
            return;
        }

        // turn loading animation off right before you display the items
        setLoading(false);

        // add the bot's reply to the messages array
        setMessages(prev => [
          ...prev, 
          {role: "bot", text: data.reply}
        ])
      } else if (mode !== "") {
        const response = await fetch("http://localhost:8000/chat", {
          method:"POST", 
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userInput, 
            mode: mode
          })
        });
        data = await response.json();

        // turn loading animation off right before you display the items
        setLoading(false);


        // add the bot's reply to the messages array    
        setMessages(prev => [
          ...prev, 
          {role: "bot", text: data.reply}
        ])
      }
      
    }
  };

  // when send button is pressed
  const handleSend = async () => {
    // set the textArea back to an empty string
    setUserInput("");

    // enter user input into messages so that it updates and shows what you typed in the textbox
    setMessages([
      ...messages, 
      {role: "user", text: userInput}, // add user input 
    ])

    // animate the displayarea
    setShowDisplay(true);
    // set loading mode on
    setLoading(true);
    setLoadingDots(".");

    const selectedMode = userInput.toLowerCase();

    let data: {reply: string};
    // call backend to get the bot's response
    if (mode === "") {
      // check if user was talking about inside or outside
      if (selectedMode === "inside") { //if user input is inside
        // get the first message 
        // works bc at this time inside_messages[] in backend is empty
        setMode("inside");
        const response = await fetch("http://localhost:8000/chat", {
          method:"POST", 
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "inside", // hard coded just to make sure it's right
            mode: selectedMode
          })
        });
        data = await response.json();
      } else if (selectedMode === "outside") { // if user input is outside
        setMode("outside");
        // get the first ouside message, same idea as inside
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "outside", // hard coded just to make sure it's right
            mode: selectedMode
          })
        });
        data = await response.json(); 
      } else {
          // user typed something invalid, maybe remove their message and prompt them
          setMessages(prev => prev.slice(0, -1)); // remove the message we just added
          // or just don't add the bot reply at all
          return;
      }

      // turn loading animation off right before you display the items
      setLoading(false);

      // add the bot's reply to the messages array
      setMessages(prev => [
        ...prev, 
        {role: "bot", text: data.reply}
      ])
    } else if (mode !== "") {
      const response = await fetch("http://localhost:8000/chat", {
        method:"POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userInput, 
          mode: mode
        })
      });
      data = await response.json();

      // turn loading animation off right before you display the items
      setLoading(false);

      // add the bot's reply to the messages array    
      setMessages(prev => [
        ...prev, 
        {role: "bot", text: data.reply}
      ]);
    }
  };

  const handleNewChat = async () => {
    setUserInput("");
    setMessages([]);
    setMode("");
    setLoading(false);
    setLoadingDots("");
    setShowDisplay(false);
    // changeNewChat(false);
    const response = await fetch("http://localhost:8000/reset", {
      method:"POST"
    });
  };

  // when new button is pressed

  return (
  <div className="flex h-screen w-screen items-center justify-start">
    <div className="flex flex-col items-start p-4">
      <button 
        onClick={handleNewChat}
        className="cursor-pointer ml-2 mr-2 p-2 rounded-lg border bg-gray-900 text-white border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
      
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus-icon lucide-plus">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
        </svg>
      </button>
    </div>
    
    <div className="flex flex-col gap-1 items-center justify-start min-h-screen pt-10 mx-auto">
      {mode === "" ? <AnimatedTitle text="Want to eat Inside or Outside?"/> : <AnimatedTitle text="What shall we eat?"/>}

      <div className="relative flex items-center rounded-xl border border-gray-300 shadow-lg w-[32vw] mt-2.5">
        <span className="absolute left-3 font-mono text-black-400">{">"}</span>
        <TextareaAutosize
          className="rounded-xl focus:outline-none resize-none p-3 pl-8 text-base font-mono w-full"
          id="input"
          placeholder={mode === "" ? "Respond with 'inside' or 'outside'..." : "Enter your request..."}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={keyDown}
          maxRows={4}
          cols={20}
        />

      <button
        onClick={handleSend}
        className="cursor-pointer ml-2 mr-2 p-2 rounded-lg border bg-gray-900 text-white border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
      </div>

      <div 
        className= {`flex flex-col self-end rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg h-[75vh] w-[85vw] mt-5 overflow-y-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`}
        id="displayArea"
      >
        {messages.map((message) => (
          message.role === "user" 
          ? <div className={`display: inline-block flex justify-right rounded-xl bg-gray-900 text-white border-gray-700 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg w-fit max-w-xl mt-2.5 mb-2.5 ml-auto mr-2.5 transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`} key={message.text}>{message.text}</div> 
          : <div className={`rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg max-w-[75vw] mt-2.5 mb-2.5 ml-2.5 mr-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`} key={message.text}><Markdown>{message.text}</Markdown></div>
        ))}
        {loading && <div className={`rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base inline-block font-mono shadow-lg w-15 mt-2.5 mb-2.5 ml-2.5 mr-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`}>{loadingDots}</div>}
        <div ref={bottomRef}></div>
      </div>
    </div>
  </div>
  );
}