"use client";
import AnimatedTitle from "./components/AnimatedTitle";
import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

export default function Home() {
  /*
    userInput is what's in the text area
    setUserInput is the function to update userInput
    useState("") is the default value of userInput which is empty string
  */
  const [userInput, setUserInput] = useState(""); 
  
  /* 
    messages is the array for all the userInputs
    setMessages is the function to update messages
    useState([]) is default value of messages which is empty array
  */
  const [messages, setMessages] = useState<string[]>([]);

  // this is for when the user inputs something into the text box
  const keyDown = (e: { key: string; preventDefault: () => void; }) => {
    // enter key is pressed down
    if (e.key == "Enter") {
      // add userInput to messages array
      // updates and sends this to the textarea for output
      setMessages([ // create new array
        ...messages, // add all the existing elements in the array
        userInput // add new element 
      ]);
      // ALWAYS PUSH LIKE THIS

      // makes sure enter doesn't create a new line in the textarea
      e.preventDefault();
      // set the textArea back to an empty string
      setUserInput("");
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center justify-start min-h-screen pt-20 mx-auto">
      <AnimatedTitle text="What shall we eat?" ></AnimatedTitle>
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
        className="rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg w-128" 
        id="output"
        readOnly={true}
        disabled={true}
        value={messages.join("\n")}
        rows={10}
       />
    </div>
  );
}
