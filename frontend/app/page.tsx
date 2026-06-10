"use client";
import AnimatedTitle from "./components/AnimatedTitle";
import { useState, useEffect,useRef } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import Markdown  from "react-markdown";
import { ThemeProvider } from "next-themes";
import Link from 'next/link'
import { UtensilsCrossed } from "lucide-react";



// make a message type to use later
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
  const [showIcon, setShowIcon] = useState(false);
  const [ingredientsMessage, setIngredientsMessage] = useState<any | null>("");
  const [ingredientsAvail, setIngredientsAvail] = useState(false);
  const [savedState, setSavedState] = useState(false);
  // const [newChat, changeNewChat] = useState(false);

  // env variables
  const chat_request: string = process.env.NEXT_PUBLIC_CHAT_REQUEST!;
  const reset_request: string = process.env.NEXT_PUBLIC_RESET_REQUEST!;


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

  // save messages, mode, showDisplay into localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
      localStorage.setItem('mode', mode);
      localStorage.setItem('showDisplay', JSON.stringify(showDisplay));
      localStorage.setItem('showIcon', JSON.stringify(showIcon));
      localStorage.setItem('ingredientsMessage', ingredientsMessage ?? "");
      localStorage.setItem('ingredientsAvail', JSON.stringify(ingredientsAvail));
    }
  }, [messages]);

  // get localStorage for messages, mode, showDisplay
  useEffect(() => {
    let saved = localStorage.getItem('messages');
    if (saved) { setMessages(JSON.parse(saved)); }
    saved = localStorage.getItem('mode');
    if (saved) { setMode(saved); }
    saved = localStorage.getItem('showDisplay'); 
    if (saved) { setShowDisplay(JSON.parse(saved)); }
    saved = localStorage.getItem('showIcon'); 
    if (saved) { setShowIcon(JSON.parse(saved)); }
    saved = localStorage.getItem('ingredientsMessage');
    if (saved) { setIngredientsMessage(saved); }
    saved = localStorage.getItem('ingredientsAvail'); 
    if (saved) { setIngredientsAvail(JSON.parse(saved)); }
  }, []);

  useEffect(() => {
    console.log('messages from storage:', localStorage.getItem('messages'));
    console.log('mode from storage:', localStorage.getItem('mode'));
    console.log('showDisplay from storage:', localStorage.getItem('showDisplay'));
    console.log('showIcon from storage:', localStorage.getItem('showIcon'));
    console.log('ingredientsMessage from storage:', localStorage.getItem('ingredientsMessage'));
    console.log('ingredientsAvail from storage:', localStorage.getItem('ingredientsAvail'));
  })

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
      ]);

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
          const response = await fetch(chat_request, {
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
          const response = await fetch(chat_request, {
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
          // user entered something else (do nothing right now) 
          setMessages(prev => prev.slice(0, -1)); // remove the message we just added
            return;
        }

        // turn loading animation off right before you display the items
        setLoading(false);

        // add the bot's reply to the messages array
        setMessages(prev => [
          ...prev, 
          {role: "bot", text: data.reply}
        ])
      } else if (mode !== "") { // mode is set and chat has been going on 
        const response = await fetch(chat_request, {
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

        // if the reply contains the word ingredients:
        // shows icon
        // sends it to the other page
        if(data.reply.includes("Ingredients")) {
          setIngredientsAvail(true);
          setShowIcon(true);
          setIngredientsMessage(data.reply); // put the ingredients and instructions list into the message array
        }

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

        const response = await fetch(chat_request, {
          method:"POST", 
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
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
        const response = await fetch(chat_request, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify({
            message: "outside", // hard coded just to make sure it's right
            mode: selectedMode
          })
        });
        data = await response.json(); 
      } else {
          // user typed something invalid, maybe remove their message 
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
      const response = await fetch(chat_request, {
        method:"POST", 
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
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

  // when user clicks on new chat
  const handleNewChat = async () => {
    setUserInput("");
    setMessages([]);
    setMode("");
    setLoading(false);
    setLoadingDots("");
    setShowDisplay(false);
    setShowIcon(false);
    setIngredientsMessage("");
    setIngredientsAvail(false);

    localStorage.removeItem('messages');
    localStorage.removeItem('mode');    
    localStorage.removeItem('showDisplay');
    localStorage.removeItem('showIcon');
    localStorage.removeItem('ingredientsMessage');
    localStorage.removeItem('ingredientsAvail');

    // changeNewChat(false);
    const response = await fetch(reset_request, {
      method:"POST",
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });
  };

  return (
  <div className="flex h-screen w-screen items-center justify-start">
    <div className="flex flex-col items-start p-4">
      <button 
        onClick={handleNewChat}
        className="cursor-pointer ml-2 mr-2 p-2 mb-1.5  rounded-lg border bg-gray-900 text-white border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
        id="newChat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </svg>
      </button>

        <button 
          className={`ml-2 mr-2 p-2 mb-1.5  rounded-lg border bg-gray-900 text-white border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center ${showIcon ? "opacity-100 cursor-pointer" : "opacity-0"}`}
          id="ingredients"
        >
          <Link href={'inside/'} hidden={showIcon ? false : true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils-crossed-icon lucide-utensils-crossed">
              <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
              <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
              <path d="m2.1 21.8 6.4-6.3"/>
              <path d="m19 5-7 7"/>
            </svg>
          </Link>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
      </div>

      <div 
        className= {`flex flex-col self-end rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg h-[80vh] w-[85vw] mt-5 overflow-y-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`}
        id="displayArea"
      >
        {messages.map((message) => (
          message.role === "user" 
          ? <div className={`display: inline-block flex justify-right rounded-xl bg-gray-900 text-white border-gray-700 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-xl w-fit max-w-xl mt-2.5 mb-2.5 ml-auto mr-2.5 transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`} key={message.text}>{message.text}</div> 
          : <div className={`rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg max-w-[75vw] mt-2.5 mb-2.5 ml-2.5 mr-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`} key={message.text}><Markdown>{message.text}</Markdown></div>
        ))}
        {loading && <div className={`rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base inline-block font-mono shadow-lg w-15 mt-2.5 mb-2.5 ml-2.5 mr-auto transition-opacity duration-700 ${showDisplay ? "opacity-100" : "opacity-0"}`}>{loadingDots}</div>}
        <div ref={bottomRef}></div>
      </div>
    </div>
  </div>
  );
}