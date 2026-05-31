"use client";
import AnimatedTitle from "./components/AnimatedTitle";
import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

export default function Home() {
  // use states
  const [userInput, setUserInput] = useState(""); 
  const [messages, setMessages] = useState<string[]>([]);
  const [mode, setMode] = useState("");

  // this is for when the user inputs something into the text box
  const keyDown = async ( e: { key: string; preventDefault: () => void; }) => {
    // enter key is pressed down
    if (e.key == "Enter") {
      // makes sure enter doesn't create a new line in the textarea
      e.preventDefault();
      // set the textArea back to an empty string
      setUserInput("");

      const selectedMode = userInput.toLowerCase();

      var data; 
      // call backend to get the bot's response
      if (mode === "") {
        // check if user was talking about inside or outside
        if (selectedMode === "inside") {
          setMode("inside");
        } else if (selectedMode === "outside") {
          setMode("outside");
        }
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

        // add userInput to messages array and bot's output
        // updates and sends this to the textarea for output
        setMessages([ // create new array
          ...messages, // add all the existing elements in the array
          userInput, // add user input 
          data.reply
        ]);
        // ALWAYS PUSH LIKE THIS
      }

    }
  };

  return (
    <div className="flex flex-col gap-1 items-center justify-start min-h-screen pt-20 mx-auto">
      <AnimatedTitle text={mode === "" ? "Inside or Outside?" : "What shall we eat?"}></AnimatedTitle>
      <TextareaAutosize
        className="rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg w-128"
        id="input"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={keyDown}
        maxRows={4}
        cols={20}
      />  

      <textarea 
        className="rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg w-256 mt-5" 
        id="output"
        readOnly={true}
        disabled={true}
        value={messages.join("\n")}
        rows={20}
       />
    </div>
  );
}
